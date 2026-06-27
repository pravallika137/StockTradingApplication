package com.trading.trading_backend.service;

import com.trading.trading_backend.entity.Stock;
import com.trading.trading_backend.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class StockService {

    private final StockRepository repository;
    private final MarketDataService marketDataService;

    public StockService(StockRepository repository,
                        MarketDataService marketDataService) {
        this.repository = repository;
        this.marketDataService = marketDataService;
    }

    // ==============================
    // CREATE STOCK
    // ==============================
    public Stock createStock(Stock stock) {
        stock.setSymbol(stock.getSymbol().toUpperCase());
        return repository.save(stock);
    }

    // ==============================
    // GET ALL STOCKS
    // ==============================
    public List<Stock> getAllStocks() {
        return repository.findAll();
    }

    // ==============================
    // GET SINGLE STOCK (Auto-create if missing)
    // ==============================
    public Stock getStockBySymbol(String symbol) {

        String upperSymbol = symbol.toUpperCase();

        return repository.findBySymbol(upperSymbol)
                .orElseGet(() -> {

                    BigDecimal livePrice;

                    try {
                        livePrice = marketDataService.getLivePrice(upperSymbol);
                    } catch (Exception e) {
                        // Prevent backend crash if API fails
                        livePrice = BigDecimal.valueOf(100);                    }

                    Stock newStock = new Stock();
                    newStock.setSymbol(upperSymbol);
                    newStock.setName(upperSymbol);
                    newStock.setLastKnownPrice(livePrice);

                    return repository.save(newStock);
                });
    }

    // ==============================
    // GET LIVE PRICE (Updates DB)
    // ==============================
    public BigDecimal getLivePrice(String symbol) {

        String upperSymbol = symbol.toUpperCase();

        BigDecimal livePrice;

        try {
            livePrice = marketDataService.getLivePrice(upperSymbol);
        } catch (Exception e) {
            throw new RuntimeException("Live price unavailable. API limit reached or invalid symbol.");
        }

        // Update stock price in DB
        repository.findBySymbol(upperSymbol).ifPresent(stock -> {
            stock.setLastKnownPrice(livePrice);
            repository.save(stock);
        });

        return livePrice;
    }

    // ==============================
    // SEARCH STOCKS
    // ==============================
    public List<Stock> searchStocks(String keyword) {
        return repository
                .findBySymbolContainingIgnoreCaseOrNameContainingIgnoreCase(keyword, keyword);
    }
    public Stock getOrCreateStock(String symbol) {

        String upperSymbol = symbol.toUpperCase();

        // 1️⃣ Check if stock already exists in DB
        return repository.findBySymbol(upperSymbol)
                .orElseGet(() -> {

                    // 2️⃣ If not, fetch live price
                    BigDecimal livePrice = marketDataService.getLivePrice(upperSymbol);

                    // 3️⃣ Create new stock
                    Stock newStock = new Stock();
                    newStock.setSymbol(upperSymbol);
                    newStock.setName(upperSymbol);
                    newStock.setLastKnownPrice(livePrice);

                    // 4️⃣ Save to DB
                    return repository.save(newStock);
                });
    }
    public Map<String, Object> getHistoricalData(String symbol) {
        return marketDataService.getHistoricalData(symbol);
    }
}