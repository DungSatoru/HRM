package tlu.finalproject.hrmanagement.dto;


import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeByDepartmentDTO {
    Long userId;
    String fullName;
    String email;
    String phone;
    String positionName;
}
