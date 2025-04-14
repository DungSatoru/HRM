package tlu.finalproject.hrmanagement.dto;


import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthResponseDTO {
    private String token;       // JWT Token
    private EmployeeDTO user;   // Thông tin nhân viên (không có password)
    private long expiresIn;     // Thời gian hết hạn của token (tính bằng giây)
}
