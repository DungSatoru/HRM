package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.config.JwtTokenProvider;
import tlu.finalproject.hrmanagement.dto.AuthRequestDTO;
import tlu.finalproject.hrmanagement.dto.AuthResponseDTO;
import tlu.finalproject.hrmanagement.dto.EmployeeDTO;
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
            // Thực hiện xác thực với username và password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequestDTO.getUsername(),
                            authRequestDTO.getPassword()
                    )
            );

            // Lấy userDetails sau khi xác thực
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Chuyển đổi từ User sang EmployeeDTO (sử dụng ModelMapper nếu cần)
            EmployeeDTO employeeDTO = modelMapper.map(user, EmployeeDTO.class);  // Sử dụng ModelMapper để chuyển User thành EmployeeDTO

            // Lấy role và loại bỏ prefix "ROLE_"
            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                    .orElse("EMPLOYEE");

            // Tạo token bằng JwtTokenProvider
            String token = jwtTokenProvider.generateToken(userDetails.getUsername(), role);

            // Lấy thời gian hết hạn token (ví dụ: 1 giờ)
            long expiresIn = jwtTokenProvider.getExpirationTime();

            // Trả về AuthResponseDTO với token, thông tin người dùng và thời gian hết hạn
            return AuthResponseDTO.builder()
                    .token(token)
                    .user(employeeDTO)
                    .expiresIn(expiresIn)
                    .build();

        } catch (AuthenticationException e) {
            // Quản lý lỗi xác thực: trả về thông báo rõ ràng hơn
            throw new RuntimeException("Invalid username or password", e);
        }
    }
}
