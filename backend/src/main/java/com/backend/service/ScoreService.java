package com.backend.service;

import com.backend.model.Score;
import com.backend.repository.ScoreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository repository;

    public ScoreService(ScoreRepository repository) {
        this.repository = repository;
    }

    public Score saveScoreForUser(Score score) {
        score.setDateTime(LocalDateTime.now());
        return repository.save(score);
    }

    public Page<Score> getTopScores(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<Score> getAllScores() {
        return repository.findAll();
    }

    public List<Score> getScoresByUsername(String username) {
        return repository.findByUserUsername(username);
    }

    public Score updateScore(Long id, Score updatedScore) {
        Score existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Score not found"));

        existing.setScore(updatedScore.getScore());
        return repository.save(existing);
    }


    public void deleteScore(Long id) {
        repository.deleteById(id);
    }
}
