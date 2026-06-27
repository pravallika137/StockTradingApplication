package com.trading.trading_backend.repository;

import com.trading.trading_backend.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface StockRepository extends JpaRepository<Stock, Long> {

    Optional<Stock> findBySymbol(String symbol);
    List<Stock> findBySymbolContainingIgnoreCase(String symbol);
    List<Stock> findByNameContainingIgnoreCase(String name);
    List<Stock> findBySymbolContainingIgnoreCaseOrNameContainingIgnoreCase(
            String symbol, String name);

}