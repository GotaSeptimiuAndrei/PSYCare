package com.backend.controller;

import com.backend.dto.MoodChartDTO;
import com.backend.dto.PatientDTO;
import com.backend.service.MoodService;
import com.backend.service.PatientService;
import com.backend.util.JwtUtil;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

  private final PatientService patientService;
  private final MoodService moodService;
  private final JwtUtil jwtUtil;

  @GetMapping
  public ResponseEntity<Page<PatientDTO>> getPatientsForDoctor(
      @PageableDefault(size = 10, sort = "patient.fullName") Pageable pageable,
      Authentication authentication) {
    Long doctorId = jwtUtil.extractUserId(authentication);
    return ResponseEntity.ok(patientService.getPatientsDoctor(doctorId, pageable));
  }

  @GetMapping("/{patientId}/mood-history")
  public ResponseEntity<List<MoodChartDTO>> getPatientMoodHistory(
      @PathVariable Long patientId,
      @RequestParam(defaultValue = "1M") String period, Authentication authentication) {
    moodService.validateMoodAccess(authentication.getName(), patientId);
    return ResponseEntity.ok(moodService.getMoodHistory(patientId, period));
  }
}