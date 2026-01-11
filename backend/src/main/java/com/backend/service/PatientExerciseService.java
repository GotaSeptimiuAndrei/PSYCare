package com.backend.service;

import com.backend.dto.PatientTaskDTO;
import com.backend.dto.TaskAssignmentDTO;
import com.backend.exception.DuplicateAssignmentException;
import com.backend.model.Exercise;
import com.backend.model.PatientExercise;
import com.backend.model.PatientExercise.ExerciseStatus;
import com.backend.model.User;
import com.backend.repository.AssignedPatientRepository;
import com.backend.repository.ExerciseRepository;
import com.backend.repository.PatientExerciseRepository;
import com.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientExerciseService {

  private final PatientExerciseRepository patientExerciseRepository;
  private final UserRepository userRepository;
  private final ExerciseRepository exerciseRepository;
  private final AssignedPatientRepository assignedPatientRepository;

  @Transactional
  public void assignTask(String psychologistEmail, TaskAssignmentDTO dto) {
    User psychologist = userRepository.findByEmail(psychologistEmail)
        .orElseThrow(() -> new UsernameNotFoundException("Psychologist not found"));

    User patient = userRepository.findById(dto.patientId())
        .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

    boolean isAssigned = assignedPatientRepository.existsByDoctorAndPatient(psychologist, patient);
    if (!isAssigned) {
      throw new AccessDeniedException("You are not assigned to this patient.");
    }

    Exercise exercise = exerciseRepository.findById(dto.exerciseId())
        .orElseThrow(() -> new EntityNotFoundException("Exercise not found"));

    boolean alreadyPending = patientExerciseRepository.existsByPatientAndExerciseAndStatus(
        patient, exercise, ExerciseStatus.PENDING);

    if (alreadyPending) {
      throw new DuplicateAssignmentException(
          "Patient already has this exercise assigned and pending.");
    }

    PatientExercise task = PatientExercise.builder()
        .patient(patient)
        .assignedBy(psychologist)
        .exercise(exercise)
        .status(ExerciseStatus.PENDING)
        .build();

    patientExerciseRepository.save(task);
  }

  @Transactional(readOnly = true)
  public List<PatientTaskDTO> getMyTasks(String patientEmail) {
    User patient = userRepository.findByEmail(patientEmail)
        .orElseThrow(() -> new UsernameNotFoundException("Patient not found"));

    return patientExerciseRepository.findByPatientOrderByAssignedAtDesc(patient).stream()
        .map(task -> new PatientTaskDTO(
            task.getId(),
            task.getExercise().getTitle(),
            task.getExercise().getDescription(),
            task.getExercise().getContentUrl(),
            task.getStatus(),
            task.getAssignedAt(),
            task.getAssignedBy().getFullName()
        ))
        .toList();
  }

  @Transactional
  public void completeTask(String patientEmail, Long taskId) {
    User patient = userRepository.findByEmail(patientEmail)
        .orElseThrow(() -> new UsernameNotFoundException("Patient not found"));

    PatientExercise task = patientExerciseRepository.findById(taskId)
        .orElseThrow(() -> new EntityNotFoundException("Task not found"));

    if (!task.getPatient().getId().equals(patient.getId())) {
      throw new AccessDeniedException("This task does not belong to you.");
    }

    task.setStatus(ExerciseStatus.COMPLETED);
    task.setCompletedAt(LocalDateTime.now());

    patientExerciseRepository.save(task);
  }
}