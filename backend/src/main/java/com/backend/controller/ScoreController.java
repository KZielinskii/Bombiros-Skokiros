package com.backend.controller;

import com.backend.model.Score;
import com.backend.service.ScoreService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @GetMapping("/pages")
    public ResponseEntity<Page<Score>> getTopScores(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("value").descending());
        return ResponseEntity.ok(scoreService.getTopScores(pageable));
    }


    @GetMapping("/user/{username}")
    public ResponseEntity<List<Score>> getUserScores(@PathVariable String username) {
        return ResponseEntity.ok(scoreService.getScoresByUsername(username));
    }
}
