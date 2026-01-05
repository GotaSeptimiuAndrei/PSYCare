package com.backend.util;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtUtil {

  private final JwtDecoder jwtDecoder;

  /**
   * Extracts userId from Spring Security Authentication object.
   *
   * @param authentication The Spring Security Authentication object
   * @return The userId from the JWT claims
   * @throws IllegalArgumentException if authentication is not a JWT token or userId is missing
   */
  public Long extractUserId(Authentication authentication) {
    if (!(authentication instanceof JwtAuthenticationToken)) {
      throw new IllegalArgumentException("Authentication is not a JWT token");
    }
    JwtAuthenticationToken jwtToken = (JwtAuthenticationToken) authentication;
    Object userIdClaim = jwtToken.getToken().getClaim("userId");
    if (userIdClaim == null) {
      throw new IllegalArgumentException("userId claim not found in JWT token");
    }
    if (userIdClaim instanceof Number) {
      return ((Number) userIdClaim).longValue();
    }
    throw new IllegalArgumentException("userId claim is not a valid number");
  }
}