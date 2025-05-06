package tlu.finalproject.hrmanagement.dto;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;
import tlu.finalproject.hrmanagement.model.Status;

import java.time.LocalDate;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeDTO {
    Long userId;
    String username;
    String identity;
    String email;
    String phone;
    String fullName;
    Long roleId;
    Long departmentId;
    Long positionId;
    Status status;
    Date hireDate;
    Date createdAt;
    Boolean gender;
    Date dateOfBirth;
    String address;
    String profileImageUrl;
    String emergencyContactName;
    String emergencyContactPhone;
    String contractType;
    String educationLevel;
}
