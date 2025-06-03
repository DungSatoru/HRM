package tlu.finalproject.hrmanagement.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import tlu.finalproject.hrmanagement.model.ContractType;
import tlu.finalproject.hrmanagement.model.EducationLevel;
import tlu.finalproject.hrmanagement.model.EmploymentStatus;

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
    EmploymentStatus status;
    Date hireDate;
    Date createdAt;
    Boolean gender;
    Date dateOfBirth;
    String address;
    String profileImageUrl;
    String emergencyContactName;
    String emergencyContactPhone;
    ContractType contractType;
    EducationLevel educationLevel;
}
