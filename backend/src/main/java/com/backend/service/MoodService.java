package com.backend.service;

import com.backend.dto.MoodChartDTO;
import com.backend.dto.MoodLogDTO;
import com.backend.model.MoodEntry;
import com.backend.model.User;
import com.backend.repository.AssignedPatientRepository;
import com.backend.repository.MoodEntryRepository;
import com.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MoodService {

  private final MoodEntryRepository moodEntryRepository;
  private final UserRepository userRepository;
  private final AssignedPatientRepository assignedPatientRepository;

  @Transactional(readOnly = true)
  public void validateMoodAccess(String requesterEmail, Long patientId) {
    User requester = userRepository.findByEmail(requesterEmail)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    // 1. If requester is a PATIENT, they can only view their own history
    if (requester.getRole().getName().equals("ROLE_PATIENT")) {
      if (!requester.getId().equals(patientId)) {
        throw new AccessDeniedException("You are not authorized to view this mood history.");
      }
    }
    // 2. If requester is a DOCTOR, they must be assigned to the patient
    else if (requester.getRole().getName().equals("ROLE_DOCTOR")) {
      User patient = userRepository.findById(patientId)
          .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

      boolean isAssigned = assignedPatientRepository.existsByDoctorAndPatient(requester, patient);
      if (!isAssigned) {
        throw new AccessDeniedException("You are not assigned to this patient.");
      }
    }
  }

  @Transactional
  @CacheEvict(value = "moodHistory", allEntries = true)
  public void logMood(String userEmail, MoodLogDTO request) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    MoodEntry entry = MoodEntry.builder()
        .user(user)
        .moodValue(request.moodValue())
        .description(request.description())
        .build();

    moodEntryRepository.save(entry);
  }

  @Transactional(readOnly = true)
  @Cacheable(value = "moodHistory", key = "#patientId + '_' + #period")
  public List<MoodChartDTO> getMoodHistory(Long patientId, String period) {
    LocalDateTime startDate = calculateStartDate(period);
    List<MoodEntry> rawEntries = moodEntryRepository.findByUserIdAndCreatedAtAfterOrderByCreatedAtAsc(
        patientId, startDate);

    // For short periods, return exact data points
    if (period.equals("1W") || period.equals("1M")) {
      return rawEntries.stream()
          .map(e -> new MoodChartDTO(e.getCreatedAt(), (double) e.getMoodValue(),
              e.getDescription()))
          .toList();
    }

    // For long periods (3M, 6M, 1Y), aggregate data by day to smooth the chart
    return aggregateByDay(rawEntries);
  }

  private LocalDateTime calculateStartDate(String period) {
    LocalDateTime now = LocalDateTime.now();
    return switch (period) {
      case "1W" -> now.minusWeeks(1);
      case "3M" -> now.minusMonths(3);
      case "6M" -> now.minusMonths(6);
      case "1Y" -> now.minusYears(1);
      default -> now.minusMonths(1);
    };
  }

  private List<MoodChartDTO> aggregateByDay(List<MoodEntry> entries) {
    // Group entries by Date (ignoring time)
    Map<LocalDate, List<MoodEntry>> groupedByDay = entries.stream()
        .collect(Collectors.groupingBy(e -> e.getCreatedAt().toLocalDate()));

    // Create one DTO per day
    List<MoodChartDTO> aggregated = new ArrayList<>();

    groupedByDay.forEach((date, dailyEntries) -> {
      // Calculate Average Score
      double avgScore = dailyEntries.stream()
          .mapToInt(MoodEntry::getMoodValue)
          .average()
          .orElse(0.0);

      // Concatenate notes (or truncate if too long)
      String notes = dailyEntries.stream()
          .filter(e -> e.getDescription() != null && !e.getDescription().isBlank())
          .map(MoodEntry::getDescription)
          .collect(Collectors.joining("; "));

      // Use the start of the day for the chart timestamp
      aggregated.add(new MoodChartDTO(date.atStartOfDay(), avgScore, notes));
    });

    aggregated.sort(Comparator.comparing(MoodChartDTO::date));

    return aggregated;
  }
}