package tlu.finalproject.hrmanagement.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

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
    Long SalarySlipId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User userId;

    @Column(name = "basic_salary")
    Double basicSalary;

    @Column(name = "overtime_pay")
    Double overTimePay;

    @Column(name = "bonus")
    Double bonus;

    @Column(name = "deductions")
    Double deductions;

    @Column(name = "total_salary")
    Double totalSalary;

    @Column(name = "payment_date")
    Date paymentDate;
}
