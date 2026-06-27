package com.trading.trading_backend.service;

import com.trading.trading_backend.dto.*;
import com.trading.trading_backend.entity.*;
import com.trading.trading_backend.repository.*;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final TransactionRepository transactionRepository;
    private final MarketDataService marketDataService;

    public TransactionService(UserRepository userRepository,
                              StockRepository stockRepository,
                              TransactionRepository transactionRepository,
                              MarketDataService marketDataService) {
        this.userRepository = userRepository;
        this.stockRepository = stockRepository;
        this.transactionRepository = transactionRepository;
        this.marketDataService = marketDataService;
    }

    // ================= BUY =================
    @Transactional
    public Transaction buy(BuyRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String symbol = request.getSymbol().toUpperCase();

        Stock stock = stockRepository.findBySymbol(symbol)
                .orElseGet(() -> stockRepository.save(new Stock(symbol, symbol, BigDecimal.ZERO)));

        BigDecimal livePrice = marketDataService.getLivePrice(symbol);

        if (livePrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Stock Price Unavailable");
        }

        stock.setLastKnownPrice(livePrice);
        stockRepository.save(stock);

        BigDecimal quantity = BigDecimal.valueOf(request.getQuantity());
        BigDecimal totalCost = livePrice.multiply(quantity);

        if (user.getBalance().compareTo(totalCost) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        user.setBalance(user.getBalance().subtract(totalCost));
        userRepository.save(user);

        Transaction tx = new Transaction();
        tx.setAction(Action.BUY);
        tx.setUser(user);
        tx.setStock(stock);
        tx.setQuantity(request.getQuantity());
        tx.setExecutedPrice(livePrice);
        tx.setTransactionTime(LocalDateTime.now());

        return transactionRepository.save(tx);
    }

    // ================= SELL =================
    @Transactional
    public Transaction sell(SellRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String symbol = request.getSymbol().toUpperCase();

        Stock stock = stockRepository.findBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        BigDecimal livePrice = marketDataService.getLivePrice(symbol);

        if (livePrice.compareTo(BigDecimal.ZERO) <= 0) {
            livePrice = stock.getLastKnownPrice();
        }

        int ownedShares = calculateNetShares(user.getId(), symbol);

        if (ownedShares < request.getQuantity()) {
            throw new RuntimeException("Not enough shares");
        }

        BigDecimal avgBuyPrice = calculateAverageBuyPrice(user.getId(), symbol);
        BigDecimal quantity = BigDecimal.valueOf(request.getQuantity());

        BigDecimal profitLoss =
                livePrice.subtract(avgBuyPrice)
                        .multiply(quantity);

        BigDecimal sellAmount = livePrice.multiply(quantity);

        user.setBalance(user.getBalance().add(sellAmount));
        userRepository.save(user);

        Transaction tx = new Transaction();
        tx.setAction(Action.SELL);
        tx.setUser(user);
        tx.setStock(stock);
        tx.setQuantity(request.getQuantity());
        tx.setSellingPrice(livePrice);
        tx.setExecutedPrice(avgBuyPrice);
        tx.setProfitLoss(profitLoss);
        tx.setTransactionTime(LocalDateTime.now());

        return transactionRepository.save(tx);
    }

    // ================= PORTFOLIO =================
    public List<PortfolioResponse> getPortfolio(Long userId) {

        List<Transaction> transactions =
                transactionRepository.findByUser_IdOrderByTransactionTimeDesc(userId);

        Map<String, List<Transaction>> grouped =
                transactions.stream()
                        .collect(Collectors.groupingBy(
                                tx -> tx.getStock().getSymbol()));

        List<PortfolioResponse> portfolio = new ArrayList<>();

        for (String symbol : grouped.keySet()) {

            int netQuantity = 0;
            int totalBuyQty = 0;
            BigDecimal totalBuyInvestment = BigDecimal.ZERO;

            for (Transaction tx : grouped.get(symbol)) {

                if (tx.getAction() == Action.BUY) {

                    netQuantity += tx.getQuantity();
                    totalBuyQty += tx.getQuantity();

                    totalBuyInvestment =
                            totalBuyInvestment.add(
                                    tx.getExecutedPrice()
                                            .multiply(BigDecimal.valueOf(tx.getQuantity()))
                            );

                } else {
                    netQuantity -= tx.getQuantity();
                }
            }

            if (netQuantity <= 0) continue;

            BigDecimal avgBuyPrice =
                    totalBuyQty > 0
                            ? totalBuyInvestment.divide(
                            BigDecimal.valueOf(totalBuyQty),
                            4,
                            RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

            BigDecimal remainingInvestment =
                    avgBuyPrice.multiply(BigDecimal.valueOf(netQuantity));

            BigDecimal currentPrice =
                    marketDataService.getLivePrice(symbol);

            if (currentPrice.compareTo(BigDecimal.ZERO) <= 0) {
                currentPrice = avgBuyPrice;
            }

            BigDecimal currentValue =
                    currentPrice.multiply(BigDecimal.valueOf(netQuantity));

            BigDecimal profitLoss =
                    currentValue.subtract(remainingInvestment);

            portfolio.add(new PortfolioResponse(
                    symbol,
                    netQuantity,
                    avgBuyPrice,
                    remainingInvestment,
                    currentValue,
                    profitLoss
            ));
        }

        return portfolio;
    }

    // ================= HELPERS =================

    private int calculateNetShares(Long userId, String symbol) {

        List<Transaction> transactions =
                transactionRepository.findByUser_IdOrderByTransactionTimeDesc(userId);

        int quantity = 0;

        for (Transaction tx : transactions) {

            if (!tx.getStock().getSymbol().equals(symbol))
                continue;

            if (tx.getAction() == Action.BUY)
                quantity += tx.getQuantity();
            else
                quantity -= tx.getQuantity();
        }

        return quantity;
    }

    private BigDecimal calculateAverageBuyPrice(Long userId, String symbol) {

        List<Transaction> transactions =
                transactionRepository.findByUser_IdOrderByTransactionTimeDesc(userId);

        BigDecimal totalInvestment = BigDecimal.ZERO;
        int totalQty = 0;

        for (Transaction tx : transactions) {

            if (!tx.getStock().getSymbol().equals(symbol))
                continue;

            if (tx.getAction() == Action.BUY) {

                totalQty += tx.getQuantity();

                totalInvestment =
                        totalInvestment.add(
                                tx.getExecutedPrice()
                                        .multiply(BigDecimal.valueOf(tx.getQuantity()))
                        );
            }
        }

        return totalQty > 0
                ? totalInvestment.divide(
                BigDecimal.valueOf(totalQty),
                4,
                RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
    }

    // ================= TRANSACTION HISTORY =================
    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository
                .findByUser_IdOrderByTransactionTimeDesc(userId);
    }
}