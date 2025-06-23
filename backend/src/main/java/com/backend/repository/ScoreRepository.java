package com.backend.repository;

import com.backend.model.Score;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    Page<Score> findByUsernameContainingIgnoreCase(String username, Pageable pageable);

    List<Score> findByUsernameIgnoreCase(String username);
}
