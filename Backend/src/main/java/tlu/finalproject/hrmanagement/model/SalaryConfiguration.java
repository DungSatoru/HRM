package tlu.finalproject.hrmanagement.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Entity
@Table(name = "salary_configurations")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SalaryConfiguration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long salaryConfigId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(name = "basic_salary")
    Double basicSalary;

    @Column(name = "standard_working_days")
    Integer standardWorkingDays;

    @Column(name = "day_overtime_rate")
    Double dayOvertimeRate;

    @Column(name = "night_overtime_rate")
    Double nightOvertimeRate;

    @Column(name = "holiday_overtime_rate")
    Double holidayOvertimeRate;

    @Column(name = "other_allowances")
    Double otherAllowances;

    @Column(name = "insurance_base_salary")
    Double insuranceBaseSalary;

    @Column(name = "work_start_time", columnDefinition = "TIME DEFAULT '08:00'")
    LocalTime workStartTime = LocalTime.of(8, 0);

    @Column(name = "work_end_time", columnDefinition = "TIME DEFAULT '17:00'")
    LocalTime workEndTime = LocalTime.of(17, 0);

    @Column(name = "break_duration_minutes", columnDefinition = "INT DEFAULT 60")
    Integer breakDurationMinutes = 60;

    @Column(name = "number_of_dependents", columnDefinition = "INT DEFAULT 0")
    Integer numberOfDependents = 0;

    @Column(name = "probation_rate", columnDefinition = "INT DEFAULT 85")
    Integer probationRate = 85;
}
