package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.AuthRequestDTO;
import tlu.finalproject.hrmanagement.dto.AuthResponseDTO;
import tlu.finalproject.hrmanagement.service.AuthService;
import tlu.finalproject.hrmanagement.config.JwtTokenProvider;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO authRequestDTO) {
        try {
            AuthResponseDTO responseDTO = authService.login(authRequestDTO);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/token") // Test hardcoded
    public ResponseEntity<?> getToken(@RequestBody AuthRequestDTO authRequest) {
        if ("admin".equals(authRequest.getUsername()) && "123456".equals(authRequest.getPassword())) {
            String token = jwtTokenProvider.generateToken(authRequest.getUsername(), "ROLE_ADMIN");
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
}
