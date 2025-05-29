package com.backend.service;

import com.backend.model.Score;
import com.backend.model.UserApp;
import com.backend.repository.ScoreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository repository;

    public ScoreService(ScoreRepository repository) {
        this.repository = repository;
    }

    public Score saveScore(Score score) {
        return repository.save(score);
    }

    public Page<Score> getTopScores(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<Score> getScoresByUser(UserApp user) {
        return repository.findByUser(user);
    }

    public List<Score> getScoresByUsername(String username) {
        return repository.findByUserUsername(username);
    }

}
