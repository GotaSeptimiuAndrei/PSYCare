package com.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ExerciseDTO(
    Long id,

    @NotBlank(message = "Title is required")
    @Size(message = "Title must be under 150 characters")
    String title,

    @NotBlank(message = "Description is required")
    String description,

    String contentUrl
) {

}