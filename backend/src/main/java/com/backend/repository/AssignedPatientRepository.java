package com.backend.repository;

import com.backend.model.AssignedPatient;
import com.backend.model.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignedPatientRepository extends JpaRepository<AssignedPatient, Long> {

  @Query("SELECT ap FROM AssignedPatient ap WHERE ap.doctor.id = :doctorId")
  Page<AssignedPatient> findByDoctor_Id(@Param("doctorId") Long doctorId, Pageable pageable);

  Optional<AssignedPatient> findByPatient(User patient);
}