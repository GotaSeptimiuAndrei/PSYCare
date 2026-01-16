package com.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.backend.dto.LoginDTO;
import com.backend.dto.MoodLogDTO;
import com.backend.dto.RegisterDTO;
import com.backend.model.Role;
import com.backend.repository.RoleRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ActiveProfiles("test")
public class FunctionalTraceabilityTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private RoleRepository roleRepository;

  private static String patientToken;

  @BeforeEach
  void setUp() {
    if (roleRepository.findByName("ROLE_PATIENT").isEmpty()) {
      roleRepository.save(Role.builder().name("ROLE_PATIENT").build());
    }
    if (roleRepository.findByName("ROLE_DOCTOR").isEmpty()) {
      roleRepository.save(Role.builder().name("ROLE_DOCTOR").build());
    }
    if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
      roleRepository.save(Role.builder().name("ROLE_ADMIN").build());
    }
  }

  /**
   * TEST CASE: TC-ADM-02 REQUIREMENT: REQ-ADM-06 (Users need to create an account) DESCRIPTION:
   * Verify that a user can successfully register with valid details.
   */
  @Test
  @Order(1)
  @DisplayName("TC-ADM-02: Verify User Registration (REQ-ADM-06)")
  void testUserRegistration() throws Exception {
    RegisterDTO registerDTO = new RegisterDTO(
        "alice.test@psycare.com",
        "password123",
        "Alice Tester"
    );

    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(registerDTO)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").exists())
        .andExpect(jsonPath("$.user.email").value("alice.test@psycare.com"));
  }

  /**
   * TEST CASE: TC-ADM-03 REQUIREMENT: REQ-ADM-07 (Secure access control/Login) DESCRIPTION: Verify
   * that a registered user can log in and receive a JWT.
   */
  @Test
  @Order(2)
  @DisplayName("TC-ADM-03: Verify User Login (REQ-ADM-07)")
  void testUserLogin() throws Exception {
    RegisterDTO setupUser = new RegisterDTO("bob.login@psycare.com", "password123", "Bob Login");
    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(setupUser)))
        .andExpect(status().isOk());

    LoginDTO loginDTO = new LoginDTO("bob.login@psycare.com", "password123");

    MvcResult result = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginDTO)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").isNotEmpty())
        .andReturn();

    String response = result.getResponse().getContentAsString();
    JsonNode jsonNode = objectMapper.readTree(response);
    if (jsonNode.has("token")) {
      patientToken = jsonNode.get("token").asText();
    } else {
      throw new AssertionError("Token not found in response: " + response);
    }
  }

  /**
   * TEST CASE: TC-P-01 REQUIREMENT: REQ-P-01 (Complementary tool for daily monitoring) DESCRIPTION:
   * Verify that a patient can log their mood using the API.
   */
  @Test
  @Order(3)
  @DisplayName("TC-P-01: Verify Patient Mood Logging (REQ-P-01)")
  void testPatientMoodLogging() throws Exception {
    String email = "carol.mood@psycare.com";
    RegisterDTO registerDTO = new RegisterDTO(email, "password123", "Carol Mood");

    // Register user and verify success
    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(registerDTO)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").exists());

    LoginDTO loginDTO = new LoginDTO(email, "password123");
    MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginDTO)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").exists())
        .andReturn();

    String responseBody = loginResult.getResponse().getContentAsString();
    JsonNode jsonNode = objectMapper.readTree(responseBody);
    if (!jsonNode.has("token")) {
      throw new AssertionError("Token not found in login response: " + responseBody);
    }
    String token = jsonNode.get("token").asText();

    MoodLogDTO moodLog = new MoodLogDTO(8, "Feeling great after therapy!");

    mockMvc.perform(post("/api/moods")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(moodLog)))
        .andExpect(status().isCreated());
  }
}