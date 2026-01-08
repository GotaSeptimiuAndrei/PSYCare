package com.backend.service;

import com.backend.dto.ExerciseDTO;
import com.backend.model.Exercise;
import com.backend.model.User;
import com.backend.repository.ExerciseRepository;
import com.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExerciseService {

  private final ExerciseRepository exerciseRepository;
  private final UserRepository userRepository;

  @Transactional(readOnly = true)
  public List<ExerciseDTO> getAllExercises() {
    return exerciseRepository.findAll().stream()
        .map(this::mapToDTO)
        .toList();
  }

  @Transactional
  public ExerciseDTO createExercise(String userEmail, ExerciseDTO dto) {
    User creator = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    Exercise exercise = Exercise.builder()
        .title(dto.title())
        .description(dto.description())
        .contentUrl(dto.contentUrl())
        .createdBy(creator)
        .build();

    Exercise saved = exerciseRepository.save(exercise);
    return mapToDTO(saved);
  }

  @Transactional
  public ExerciseDTO updateExercise(Long id, ExerciseDTO dto) {
    Exercise exercise = exerciseRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Exercise not found with id: " + id));

    exercise.setTitle(dto.title());
    exercise.setDescription(dto.description());
    exercise.setContentUrl(dto.contentUrl());

    return mapToDTO(exerciseRepository.save(exercise));
  }

  @Transactional
  public void deleteExercise(Long id) {
    if (!exerciseRepository.existsById(id)) {
      throw new EntityNotFoundException("Exercise not found with id: " + id);
    }
    exerciseRepository.deleteById(id);
  }

  private ExerciseDTO mapToDTO(Exercise exercise) {
    return new ExerciseDTO(
        exercise.getId(),
        exercise.getTitle(),
        exercise.getDescription(),
        exercise.getContentUrl()
    );
  }
}