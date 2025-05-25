package tlu.finalproject.hrmanagement.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "salary_slips")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SalarySlip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long salarySlipId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(name = "standard_working_hours")
    Double standardWorkingHours; // Số giờ công chuẩn ngày

    @Column(name = "standard_working_days")
    Integer standardWorkingDays; // Số ngày công chuẩn tháng

    @Column(name = "actual_working_hours")
    Double actualWorkingHours; // Số giờ công thực tế

    @Column(name = "actual_working_days")
    Double actualWorkingDays; // Số ngày công thực tế

    // Lương cơ bản thực tế (dựa trên số ngày làm việc)
    @Column(name = "actual_basic_salary")
    Double actualBasicSalary;

    @Column(name = "other_allowances")
    Double otherAllowances;

    @Column(name = "day_overtime_Pay")
    Double dayOvertimePay;

    @Column(name = "night_overtime_Pay")
    Double nightOvertimePay;

    @Column(name = "total_bonus")
    Double totalBonus;

    @Column(name = "total_deductions")
    Double totalDeductions;

    @Column(name = "total_salary")
    Double totalSalary;

    @Column(name = "payment_date")
    LocalDate paymentDate;

    @Column(name = "salary_period")
    String salaryPeriod; // Ví dụ: "2025-05"

    @Column(name = "calculation_date")
    LocalDate calculationDate;
}
