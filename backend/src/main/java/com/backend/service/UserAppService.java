package com.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.model.UserApp;
import com.backend.repository.UserAppRepository;

@Service
public class UserAppService {

    private final UserAppRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserAppService(UserAppRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserApp createUser(UserApp user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Użytkownik o podanej nazwie już istnieje");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public Optional<UserApp> getUserByUsername(String username) {
    return userRepository.findByUsername(username);
    }
}