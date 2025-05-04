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
    Long userId;
    Double basicSalary;
    Double overtimeRate;
    Double bonusRate;
    Double otherAllowances;
    Double insuranceBaseSalary;
}
