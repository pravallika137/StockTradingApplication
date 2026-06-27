package com.trading.trading_backend.controller;

import com.trading.trading_backend.dto.*;
import com.trading.trading_backend.entity.Transaction;
import com.trading.trading_backend.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    private final TransactionService transactionService;

    // ✅ Correct Constructor Injection
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // ======================
    // ✅ BUY
    // ======================
    @PostMapping("/buy")
    public Transaction buy(@RequestBody BuyRequest request) {
        return transactionService.buy(request);
    }

    // ======================
    // ✅ SELL
    // ======================
    @PostMapping("/sell")
    public Transaction sell(@RequestBody SellRequest request) {
        return transactionService.sell(request);
    }

    // ======================
    // ✅ HISTORY
    // ======================
    @GetMapping("/history/{userId}")
    public List<Transaction> getTransactionHistory(@PathVariable Long userId) {
        return transactionService.getUserTransactions(userId);
    }

    // ======================
    // ✅ PORTFOLIO
    // ======================
    @GetMapping("/portfolio/{userId}")
    public List<PortfolioResponse> portfolio(@PathVariable Long userId) {
        return transactionService.getPortfolio(userId);
    }
}