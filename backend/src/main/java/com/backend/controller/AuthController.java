package com.backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.model.UserApp;
import com.backend.service.UserAppService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserAppService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserAppService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserApp user) {
        try {
            UserApp created = userService.createUser(user);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<UserApp> userOpt = userService.getUserByUsername(username);
        if (userOpt.isPresent()) {
            UserApp user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(401).body(Map.of("message", "Nieprawidłowe dane logowania"));
    }


}
