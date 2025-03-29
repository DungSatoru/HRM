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
    String identity;
    String email;
    String phone;
    String fullName;
    RoleDTO role;
    DepartmentDTO department;
    PositionDTO position;
    Status status;
    Date hireDate;
    Date createdAt;
}
