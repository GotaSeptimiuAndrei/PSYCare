package com.backend.controller;

import com.backend.dto.PatientTaskDTO;
import com.backend.dto.TaskAssignmentDTO;
import com.backend.service.PatientExerciseService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

  private final PatientExerciseService patientExerciseService;

  @PostMapping("/assignments")
  public ResponseEntity<String> assignHomework(
      Principal principal,
      @Valid @RequestBody TaskAssignmentDTO dto) {
    patientExerciseService.assignTask(principal.getName(), dto);
    return ResponseEntity.status(HttpStatus.CREATED).body("Exercise assigned successfully");
  }

  @GetMapping("/patient/tasks")
  public ResponseEntity<List<PatientTaskDTO>> getMyTasks(Principal principal) {
    return ResponseEntity.ok(patientExerciseService.getMyTasks(principal.getName()));
  }

  @PatchMapping("/assignments/{taskId}/complete")
  public ResponseEntity<String> completeTask(
      Principal principal,
      @PathVariable Long taskId) {
    patientExerciseService.completeTask(principal.getName(), taskId);
    return ResponseEntity.ok("Task marked as completed");
  }
}