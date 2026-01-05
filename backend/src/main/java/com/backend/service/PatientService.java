package com.backend.service;

import com.backend.dto.PatientDTO;
import com.backend.model.AssignedPatient;
import com.backend.model.MoodEntry;
import com.backend.model.User;
import com.backend.repository.AssignedPatientRepository;
import com.backend.repository.MoodEntryRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientService {

  private final AssignedPatientRepository assignedPatientRepository;
  private final MoodEntryRepository moodEntryRepository;

  @Transactional(readOnly = true)
  public Page<PatientDTO> getPatientsDoctor(Long doctorId, Pageable pageable) {
    Page<AssignedPatient> assignedPatientsPage = assignedPatientRepository.findByDoctor_Id(doctorId,
        pageable);

    List<User> patients = assignedPatientsPage.getContent().stream()
        .map(AssignedPatient::getPatient)
        .collect(Collectors.toList());

    Map<Long, Integer> moodMap = moodEntryRepository.findLatestMoodsForUsers(patients)
        .stream()
        .collect(Collectors.toMap(m -> m.getUser().getId(), MoodEntry::getMoodValue));

    return assignedPatientsPage.map(assignedPatient -> {
      User patient = assignedPatient.getPatient();
      return new PatientDTO(
          patient.getId(),
          patient.getFullName(),
          patient.getEmail(),
          moodMap.getOrDefault(patient.getId(), null),
          patient.getUpdatedAt()
      );
    });
  }
}