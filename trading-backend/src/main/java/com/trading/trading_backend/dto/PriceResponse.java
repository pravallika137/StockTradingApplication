package com.trading.trading_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PriceResponse {

    private String symbol;
    private BigDecimal price;
    private LocalDateTime timestamp;

    public PriceResponse(String symbol, BigDecimal price) {
        this.symbol = symbol;
        this.price = price;
        this.timestamp = LocalDateTime.now();
    }

    public String getSymbol() { return symbol; }
    public BigDecimal getPrice() { return price; }
    public LocalDateTime getTimestamp() { return timestamp; }
}