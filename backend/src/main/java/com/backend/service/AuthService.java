package com.backend.service;

import com.backend.dto.LoginDTO;
import com.backend.dto.LoginResponseDTO;
import com.backend.dto.RegisterDTO;
import com.backend.exception.EmailAlreadyExistsException;
import com.backend.model.Role;
import com.backend.model.User;
import com.backend.repository.RoleRepository;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final TokenService tokenService;

  @Transactional
  public LoginResponseDTO registerUser(RegisterDTO request) {
    if (userRepository.findByEmail(request.email()).isPresent()) {
      throw new EmailAlreadyExistsException(request.email());
    }

    // Default Role
    Role patientRole = roleRepository.findByName("ROLE_PATIENT")
        .orElseThrow(() -> new RuntimeException("Default role ROLE_PATIENT not found in DB"));

    User user = User.builder()
        .email(request.email())
        .password(passwordEncoder.encode(request.password()))
        .fullName(request.fullName())
        .role(patientRole)
        .build();

    userRepository.save(user);

    return loginUser(new LoginDTO(request.email(), request.password()));
  }

  @Transactional(readOnly = true)
  public LoginResponseDTO loginUser(LoginDTO request) {
    Authentication auth = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password())
    );

    String token = tokenService.generateToken(auth);

    User user = userRepository.findByEmail(request.email()).orElseThrow();

    return new LoginResponseDTO(token, LoginResponseDTO.UserDTO.fromEntity(user));
  }
}