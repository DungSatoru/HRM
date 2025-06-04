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
     String token;       // JWT Token
    EmployeeDTO user;   // Thông tin nhân viên (không có password)
    String roleName;
     long expiresIn;     // Thời gian hết hạn của token (tính bằng giây)
}
