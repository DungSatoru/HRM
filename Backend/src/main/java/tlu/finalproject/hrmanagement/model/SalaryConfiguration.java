package tlu.finalproject.hrmanagement.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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

    @Column(name = "overtime_rate")
    Double overtimeRate;

    @Column(name = "bonus_rate")
    Double bonusRate;

    @Column(name = "other_allowances")
    Double otherAllowances;
}
