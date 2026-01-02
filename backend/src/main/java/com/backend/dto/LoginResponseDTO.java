package com.backend.dto;

import com.backend.model.User;

public record LoginResponseDTO(
    String token,
    UserDTO user
) {

  public record UserDTO(Long id, String email, String fullName, String role) {

    public static UserDTO fromEntity(User user) {
      return new UserDTO(
          user.getId(),
          user.getEmail(),
          user.getFullName(),
          user.getRole().getName()
      );
    }
  }
}