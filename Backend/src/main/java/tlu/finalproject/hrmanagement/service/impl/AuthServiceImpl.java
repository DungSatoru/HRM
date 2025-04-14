package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.config.JwtTokenProvider;
import tlu.finalproject.hrmanagement.dto.AuthRequestDTO;
import tlu.finalproject.hrmanagement.service.AuthService;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public String login(AuthRequestDTO authRequestDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequestDTO.getUsername(),
                            authRequestDTO.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Lấy role và loại bỏ prefix "ROLE_"
            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                    .orElse("EMPLOYEE");

            // Tạo token
            return jwtTokenProvider.generateToken(userDetails.getUsername(), role);

        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password");
        }
    }
}
