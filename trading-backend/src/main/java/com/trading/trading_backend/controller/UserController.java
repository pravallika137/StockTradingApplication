package com.trading.trading_backend.controller;

import com.trading.trading_backend.entity.User;
import com.trading.trading_backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ Create new user (Register alternative)
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.create(user);
    }

    // ✅ Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAll();
    }

    // ✅ Get user by ID
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getById(id);
    }

    // ✅ Update balance (deposit money)
    @PutMapping("/{id}/balance")
    public User updateBalance(@PathVariable Long id,
                              @RequestParam BigDecimal amount) {
        return userService.updateBalance(id, amount);
    }
}
