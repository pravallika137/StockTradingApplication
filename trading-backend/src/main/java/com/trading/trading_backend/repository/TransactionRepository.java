package com.trading.trading_backend.repository;

import com.trading.trading_backend.entity.Action;
import com.trading.trading_backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // ✅ FIXED METHOD (IMPORTANT CHANGE HERE)
    Optional<Transaction>
    findTopByUser_IdAndStock_SymbolAndActionOrderByTransactionTimeDesc(
            Long userId,
            String symbol,
            Action action
    );
    // ✅ shares owned
    @Query("""
           SELECT COALESCE(SUM(
               CASE
                   WHEN t.action = 'BUY' THEN t.quantity
                   WHEN t.action = 'SELL' THEN -t.quantity
               END), 0)
           FROM Transaction t
           WHERE t.user.id = :userId AND t.stock.symbol = :symbol
           """)
    int getNetShares(@Param("userId") Long userId,
                     @Param("symbol") String symbol);

    // ✅ transaction history
    List<Transaction> findByUser_IdOrderByTransactionTimeDesc(Long userId);
}