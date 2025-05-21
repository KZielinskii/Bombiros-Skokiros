package com.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.backend.model.UserApp;
import com.backend.repository.UserAppRepository;

@Service
public class UserAppService {

    private final UserAppRepository userRepository;

    public UserAppService(UserAppRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<UserApp> getUserByUsername(String username) {
    return userRepository.findByUsername(username);
    }

    public List<UserApp> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserApp> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public UserApp createUser(UserApp user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}