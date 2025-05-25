package tlu.finalproject.hrmanagement.dto;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import tlu.finalproject.hrmanagement.model.User;

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
    String fullName;
    DepartmentDTO department;
    PositionDTO position;
    Double standardWorkingHours; // Số giờ công chuẩn ngày
    Integer standardWorkingDays; // Số ngày công chuẩn tháng
    Double actualWorkingHours; // Số giờ công thực tế
    Double actualWorkingDays; // Số ngày công thực tế
    Double actualBasicSalary;
    Double otherAllowances;
    Double dayOvertimePay;
    Double nightOvertimePay;
    Double totalBonus;
    Double totalDeductions;
    Double totalSalary;
    LocalDate paymentDate;
    String salaryPeriod; // Ví dụ: "2025-05"
    LocalDate calculationDate;
}
