package com.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "patient_exercises", indexes = {
    @Index(name = "idx_patient_exercises_patient_status", columnList = "patient_id, status"),
    @Index(name = "idx_patient_exercises_doctor", columnList = "assigned_by_user_id")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientExercise {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "patient_id", nullable = false, foreignKey = @ForeignKey(name = "fk_patient_exercises_patient"))
  private User patient;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "exercise_id", nullable = false, foreignKey = @ForeignKey(name = "fk_patient_exercises_exercise"))
  private Exercise exercise;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "assigned_by_user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_patient_exercises_doctor"))
  private User assignedBy;

  @Column(name = "status", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  @Builder.Default
  private ExerciseStatus status = ExerciseStatus.PENDING;

  @CreationTimestamp
  @Column(name = "assigned_at", nullable = false, updatable = false)
  private LocalDateTime assignedAt;

  @Column(name = "completed_at")
  private LocalDateTime completedAt;

  public enum ExerciseStatus {
    PENDING, COMPLETED
  }
}