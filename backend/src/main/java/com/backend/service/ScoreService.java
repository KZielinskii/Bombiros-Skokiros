package com.backend.service;

import com.backend.model.Score;
import com.backend.model.UserApp;
import com.backend.repository.ScoreRepository;
import com.backend.repository.UserAppRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository repository;
    private final UserAppRepository userAppRepository;

    public ScoreService(ScoreRepository repository, UserAppRepository userAppRepository) {
        this.repository = repository;
        this.userAppRepository = userAppRepository;
    }

    public Score saveScoreForUser(Score score) {
        score.setDateTime(LocalDateTime.now());
        return repository.save(score);
    }

    public Page<Score> getTopScores(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<Score> getScoresByUsername(String username) {
        return repository.findByUserUsername(username);
    }

    public void deleteScore(Long id) {
        repository.deleteById(id);
    }
}
