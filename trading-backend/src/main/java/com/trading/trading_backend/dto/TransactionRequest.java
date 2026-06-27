package com.trading.trading_backend.dto;

public class TransactionRequest {

    private Long userId;
    private String stockSymbol;
    private Integer quantity;
    private double sellingPrice;


    public Long getUserId() {
        return userId;
    }

    public String getStockSymbol() {
        return stockSymbol;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setStockSymbol(String stockSymbol) {
        this.stockSymbol = stockSymbol;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
