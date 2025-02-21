package tlu.finalproject.hrmanagement.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import tlu.finalproject.hrmanagement.model.Status;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {
    Long userId;
    String username;
    String email;
    String phone;
    String fullName;
    String roleName; // Lấy từ role entity
    String departmentName; // Lấy từ department entity
    String positionName; // Lấy từ position entity
    Long departmentId;  // ID phòng ban
    Long positionId;    // ID vị trí
    Status status;
    Date hireDate;
    Date createdAt;
}
