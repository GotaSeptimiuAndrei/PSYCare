package com.backend.controller;

import com.backend.dto.MoodLogDTO;
import com.backend.service.MoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/moods")
@RequiredArgsConstructor
public class MoodController {

  private final MoodService moodService;

  @PostMapping
  public ResponseEntity<String> logMood(@Valid @RequestBody MoodLogDTO body,
      Authentication authentication) {
    moodService.logMood(authentication.getName(), body);

    return ResponseEntity.status(HttpStatus.CREATED).body("Mood logged successfully");
  }
}