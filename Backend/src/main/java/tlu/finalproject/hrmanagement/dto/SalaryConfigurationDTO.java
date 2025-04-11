package tlu.finalproject.hrmanagement.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import tlu.finalproject.hrmanagement.model.User;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalaryConfigurationDTO {
    Long salaryConfigId;
    User user;
    Double basicSalary;
    Double overtimeRate;
    Double bonus;
    Double otherAllowances;
}
