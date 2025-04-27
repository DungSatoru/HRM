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
public class SalaryResultDTO {
    Long userId;
    LocalDate month;
    Double basicSalary;
    Double totalBonus;
    Double totalDeductions;
    Double totalOvertimePay;
    Double netSalary;
}
