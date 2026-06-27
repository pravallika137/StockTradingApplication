package com.trading.trading_backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "stocks")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String symbol;

    @Column(nullable = false)
    private String name;

    @Column(precision = 19, scale = 2)
    private BigDecimal lastKnownPrice = BigDecimal.ZERO;

    public Stock() {}

    public Stock(String symbol, String name, BigDecimal lastKnownPrice) {
        this.symbol = symbol;
        this.name = name;
        this.lastKnownPrice = lastKnownPrice;
    }

    public Long getId() { return id; }

    public String getSymbol() { return symbol; }

    public String getName() { return name; }

    public BigDecimal getLastKnownPrice() { return lastKnownPrice; }

    public void setId(Long id) { this.id = id; }

    public void setSymbol(String symbol) { this.symbol = symbol; }

    public void setName(String name) { this.name = name; }

    public void setLastKnownPrice(BigDecimal lastKnownPrice) {
        this.lastKnownPrice = lastKnownPrice;
    }
}