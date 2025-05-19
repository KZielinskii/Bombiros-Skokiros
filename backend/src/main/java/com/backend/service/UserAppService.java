package com.backend.service;

import com.backend.model.UserApp;
import com.backend.repository.UserAppRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserAppService {

    private final UserAppRepository userRepository;

    public UserAppService(UserAppRepository userRepository) {
        this.userRepository = userRepository;
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