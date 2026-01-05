package com.backend.controller;

import com.backend.dto.PatientDTO;
import com.backend.service.PatientService;
import com.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

  private final PatientService patientService;
  private final JwtUtil jwtUtil;

  @GetMapping
  public ResponseEntity<Page<PatientDTO>> getPatientsForDoctor(
      @PageableDefault(size = 10, sort = "patient.fullName") Pageable pageable,
      Authentication authentication) {
    Long doctorId = jwtUtil.extractUserId(authentication);
    return ResponseEntity.ok(patientService.getPatientsDoctor(doctorId, pageable));
  }
}