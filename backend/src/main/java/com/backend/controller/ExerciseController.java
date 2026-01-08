package com.backend.controller;

import com.backend.dto.ExerciseDTO;
import com.backend.service.ExerciseService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

  private final ExerciseService exerciseService;

  @GetMapping
  public ResponseEntity<List<ExerciseDTO>> getAllExercises() {
    return ResponseEntity.ok(exerciseService.getAllExercises());
  }

  @PostMapping
  public ResponseEntity<ExerciseDTO> createExercise(
      Principal principal,
      @Valid @RequestBody ExerciseDTO dto) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(exerciseService.createExercise(principal.getName(), dto));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ExerciseDTO> updateExercise(
      @PathVariable Long id,
      @Valid @RequestBody ExerciseDTO dto) {
    return ResponseEntity.ok(exerciseService.updateExercise(id, dto));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteExercise(@PathVariable Long id) {
    exerciseService.deleteExercise(id);
    return ResponseEntity.ok("Exercise deleted successfully");
  }
}