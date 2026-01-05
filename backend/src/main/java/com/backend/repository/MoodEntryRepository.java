package com.backend.repository;

import com.backend.model.MoodEntry;
import com.backend.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {

  List<MoodEntry> findByUserOrderByCreatedAtDesc(User user);

  @Query("SELECT m FROM MoodEntry m WHERE m.user IN :users AND m.createdAt = (SELECT MAX(m2.createdAt) FROM MoodEntry m2 WHERE m2.user = m.user)")
  List<MoodEntry> findLatestMoodsForUsers(@Param("users") List<User> users);
}