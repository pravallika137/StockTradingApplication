package com.trading.trading_backend.service;

import com.trading.trading_backend.entity.User;
import com.trading.trading_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public User create(User user) {

        // Ensure balance is never null
        if (user.getBalance() == null) {
            user.setBalance(BigDecimal.ZERO);
        }

        return repo.save(user);
    }

    public List<User> getAll() {
        return repo.findAll();
    }

    public User getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 💰 Correct BigDecimal balance update
    public User updateBalance(Long id, BigDecimal amount) {

        User user = getById(id);

        if (amount == null) {
            throw new RuntimeException("Amount cannot be null");
        }

        user.setBalance(
                user.getBalance().add(amount)
        );

        return repo.save(user);
    }
}