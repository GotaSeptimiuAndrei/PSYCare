package com.backend.dto;

import java.time.LocalDateTime;

public record MoodChartDTO(
    LocalDateTime date,
    Double score,
    String note
) {

}