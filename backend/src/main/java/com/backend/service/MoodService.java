package com.backend.service;

import com.backend.dto.MoodLogDTO;
import com.backend.model.MoodEntry;
import com.backend.model.User;
import com.backend.repository.MoodEntryRepository;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MoodService {

  private final MoodEntryRepository moodEntryRepository;
  private final UserRepository userRepository;

  @Transactional
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
}
