package com.backend.repository;

import com.backend.model.UserApp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserAppRepository extends JpaRepository<UserApp, Long> {
    Optional<UserApp> findByUsername(String login);
}
