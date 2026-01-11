package com.backend.exception;

public class DuplicateAssignmentException extends RuntimeException {

  public DuplicateAssignmentException(String message) {
    super(message);
  }
}