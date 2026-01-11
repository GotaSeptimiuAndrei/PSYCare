package com.backend.repository;

import com.backend.model.Exercise;
import com.backend.model.PatientExercise;
import com.backend.model.PatientExercise.ExerciseStatus;
import com.backend.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientExerciseRepository extends JpaRepository<PatientExercise, Long> {

  List<PatientExercise> findByPatientOrderByAssignedAtDesc(User patient);

  boolean existsByPatientAndExerciseAndStatus(User patient, Exercise exercise,
      ExerciseStatus status);
}