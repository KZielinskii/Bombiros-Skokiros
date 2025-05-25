package com.backend.controller;

import com.backend.model.Score;
import com.backend.service.ScoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {

    private final ScoreService scoreService;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @PostMapping
    public ResponseEntity<Score> saveScore(@RequestBody Score score) {
        return ResponseEntity.ok(scoreService.saveScore(score));
    }

    @GetMapping("/top")
    public ResponseEntity<List<Score>> getTopScores() {
        return ResponseEntity.ok(scoreService.getTopScores());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Score>> getUserScores(@PathVariable String username) {
        return ResponseEntity.ok(scoreService.getScoresByUsername(username));
    }
}
