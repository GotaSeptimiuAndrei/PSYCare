package com.backend.dto;

import com.backend.model.PatientExercise.ExerciseStatus;
import java.time.LocalDateTime;

public record PatientTaskDTO(
    Long id,
    String exerciseTitle,
    String exerciseDescription,
    String contentUrl,
    ExerciseStatus status,
    LocalDateTime assignedDate,
    String psychologistName
) {

}