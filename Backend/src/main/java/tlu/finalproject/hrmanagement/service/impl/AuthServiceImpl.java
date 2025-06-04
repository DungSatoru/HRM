package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.config.JwtTokenProvider;
import tlu.finalproject.hrmanagement.dto.AuthRequestDTO;
import tlu.finalproject.hrmanagement.dto.AuthResponseDTO;
import tlu.finalproject.hrmanagement.dto.EmployeeDTO;
import tlu.finalproject.hrmanagement.exception.BadRequestException;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.User;
import tlu.finalproject.hrmanagement.repository.UserRepository;
import tlu.finalproject.hrmanagement.service.AuthService;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public AuthResponseDTO login(AuthRequestDTO authRequestDTO) {
        try {
            // Xác thực username + password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequestDTO.getUsername(),
                            authRequestDTO.getPassword()
                    )
            );

            // Lấy user sau xác thực
            User user = userRepository.findByUsername(authRequestDTO.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với tên đăng nhập: " + authRequestDTO.getUsername()));

            // Chuyển sang DTO
            EmployeeDTO employeeDTO = modelMapper.map(user, EmployeeDTO.class);

            String role = authentication.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse(null);


            // Sinh token
            String token = jwtTokenProvider.generateToken(user.getUsername(), role);
            long expiresIn = jwtTokenProvider.getExpirationTime();

            return AuthResponseDTO.builder()
                    .token(token)
                    .user(employeeDTO)
                    .expiresIn(expiresIn)
                    .build();

        } catch (AuthenticationException e) {
            throw new BadRequestException("Tên đăng nhập hoặc mật khẩu không đúng.");
        } catch (Exception e) {
            throw new RuntimeException("Đã xảy ra lỗi trong quá trình đăng nhập: " + e.getMessage());
        }
    }
}
