package com.backend.service;

import com.backend.model.User;
import com.backend.repository.UserRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {

  private final JwtEncoder encoder;
  private final UserRepository userRepository;

  public String generateToken(Authentication authentication) {
    Instant now = Instant.now();
    String email = authentication.getName();

    // Fetch the full user details to add ID and Name to the token
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

    // Extract roles (e.g., ["ROLE_DOCTOR"])
    List<String> roles = authentication.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.toList());

    // Build the JWT Claims
    JwtClaimsSet claims = JwtClaimsSet.builder()
        .issuer("self")
        .issuedAt(now)
        .expiresAt(now.plus(1, ChronoUnit.HOURS))
        .subject(email)
        .claim("roles", roles)
        .claim("userId", user.getId())
        .claim("fullName", user.getFullName())
        .build();

    return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
  }
}