package com.backend.repository;

import com.backend.model.Score;
import com.backend.model.UserApp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByUserUsername(String username);
}
