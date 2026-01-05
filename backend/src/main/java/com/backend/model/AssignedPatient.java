package com.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "assigned_patients",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_assigned_patients_patient", columnNames = "patient_id")
    },
    indexes = {
        @Index(name = "idx_assigned_patients_doctor", columnList = "doctor_id")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignedPatient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "doctor_id", nullable = false, foreignKey = @ForeignKey(name = "fk_assigned_patients_doctor"))
  private User doctor;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "patient_id", nullable = false, unique = true, foreignKey = @ForeignKey(name = "fk_assigned_patients_patient"))
  private User patient;

  @CreationTimestamp
  @Column(name = "assigned_at", nullable = false, updatable = false)
  private LocalDateTime assignedAt;
}