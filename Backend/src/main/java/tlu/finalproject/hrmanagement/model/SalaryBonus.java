package tlu.finalproject.hrmanagement.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "salary_bonuses")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SalaryBonus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bonus_id")
    Long bonusId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @Column(name = "bonus_type")
    String bonusType;

    @Column(name = "amount")
    Double amount;

    @Column(name = "bonus_date")
    LocalDate bonusDate;

}
