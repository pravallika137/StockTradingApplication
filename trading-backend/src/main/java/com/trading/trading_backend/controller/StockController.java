package com.trading.trading_backend.controller;

import com.trading.trading_backend.dto.PriceResponse;
import com.trading.trading_backend.entity.Stock;
import com.trading.trading_backend.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "http://localhost:3000")
public class StockController {

    private final StockService service;

    public StockController(StockService service) {
        this.service = service;
    }

    // =========================
    // CREATE STOCK
    // =========================
    @PostMapping
    public Stock createStock(@RequestBody Stock stock) {
        return service.createStock(stock);
    }

    // =========================
    // GET ALL STOCKS
    // =========================
    @GetMapping
    public List<Stock> getAllStocks() {
        return service.getAllStocks();
    }

    // =========================
    // GET STOCK BY SYMBOL
    // =========================
    @GetMapping("/{symbol}")
    public ResponseEntity<?> getStock(@PathVariable String symbol) {
        try {
            Stock stock = service.getOrCreateStock(symbol);
            return ResponseEntity.ok(stock);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // =========================
    // GET LIVE PRICE
    // =========================
    @GetMapping("/{symbol}/price")
    public PriceResponse getLivePrice(@PathVariable String symbol) {
        BigDecimal price = service.getLivePrice(symbol);
        return new PriceResponse(symbol, price);
    }

    // =========================
    // SEARCH STOCK
    // =========================
    @GetMapping("/search")
    public List<Stock> searchStocks(@RequestParam String keyword) {
        return service.searchStocks(keyword);
    }

    @GetMapping("/{symbol}/history")
    public ResponseEntity<?> getStockHistory(@PathVariable String symbol) {
        try {
            return ResponseEntity.ok(service.getHistoricalData(symbol));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

