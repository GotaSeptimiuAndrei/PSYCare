package com.backend.dto;

import java.time.LocalDateTime;

public record PatientDTO(
    Long id,
    String fullName,
    String email,
    Integer lastMoodValue,
    LocalDateTime lastSeen
) {

}