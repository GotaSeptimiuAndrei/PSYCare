package com.backend.repository;

import com.backend.model.MoodEntry;
import com.backend.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {

  List<MoodEntry> findByUserOrderByCreatedAtDesc(User user);
}