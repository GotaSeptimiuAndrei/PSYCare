package com.backend.controller;

import com.backend.exception.DuplicateAssignmentException;
import com.backend.exception.EmailAlreadyExistsException;
import com.backend.exception.InvalidCredentialsException;
import jakarta.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(EmailAlreadyExistsException.class)
  public ProblemDetail handleEmailExists(EmailAlreadyExistsException ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
  }

  @ExceptionHandler(DuplicateAssignmentException.class)
  public ProblemDetail handleDuplicateAssignment(DuplicateAssignmentException ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
  }

  @ExceptionHandler({InvalidCredentialsException.class, BadCredentialsException.class})
  public ProblemDetail handleBadCredentials(Exception ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex) {
    ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
        "Validation failed");
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(error ->
        errors.put(error.getField(), error.getDefaultMessage())
    );
    problemDetail.setProperty("errors", errors);
    return problemDetail;
  }

  @ExceptionHandler({EntityNotFoundException.class, UsernameNotFoundException.class})
  public ProblemDetail handleNotFound(Exception ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ProblemDetail handleAccessDenied(AccessDeniedException ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, ex.getMessage());
  }

  /**
   * Fallback for any other unexpected errors. Maps to 500 Internal Server Error.
   */
  @ExceptionHandler(Exception.class)
  public ProblemDetail handleGeneralError(Exception ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
        "An unexpected error occurred");
  }
}