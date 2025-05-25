package tlu.finalproject.hrmanagement.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import tlu.finalproject.hrmanagement.model.User;

import java.time.LocalTime;

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
    Integer standardWorkingDays;
    Double dayOvertimeRate;
    Double nightOvertimeRate;
    Double holidayOvertimeRate;
    Double otherAllowances;
    Double insuranceBaseSalary;
    LocalTime workStartTime;
    LocalTime workEndTime;
    Integer breakDurationMinutes;
    Integer numberOfDependents;
}
