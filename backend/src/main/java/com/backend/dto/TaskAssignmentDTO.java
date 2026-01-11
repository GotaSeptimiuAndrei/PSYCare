package com.backend.dto;

import jakarta.validation.constraints.NotNull;

public record TaskAssignmentDTO(
    @NotNull(message = "Patient ID is required")
    Long patientId,

    @NotNull(message = "Exercise ID is required")
    Long exerciseId
) {

}