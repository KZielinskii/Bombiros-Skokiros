package com.backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
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

    public AuthController(UserAppService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserApp user) {
        System.out.println("Received username: " + user.getUsername());
        System.out.println("Received password: " + user.getPassword());
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<UserApp> userOpt = userService.getUserByUsername(username);
        if (userOpt.isPresent()) {
            UserApp user = userOpt.get();
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
