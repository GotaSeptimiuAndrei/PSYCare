package com.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MoodLogDTO(
    @NotNull(message = "Mood value is required")
    @Min(value = 1, message = "Mood must be at least 1")
    @Max(value = 10, message = "Mood must be at most 10")
    Integer moodValue,

    @Size(max = 200, message = "Journal entry cannot exceed 200 characters")
    String description
) {

}