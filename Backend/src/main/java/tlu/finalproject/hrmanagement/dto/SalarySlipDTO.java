package tlu.finalproject.hrmanagement.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalarySlipDTO {
    Long salarySlipId;
    Long userId;
    Double basicSalary;
    Double actualBasicSalary;
    Double otherAllowances;
    Double overTimePay;
    Double bonus;
    Double deductions;
    Double totalSalary;
    LocalDate paymentDate;
    String month;
}
