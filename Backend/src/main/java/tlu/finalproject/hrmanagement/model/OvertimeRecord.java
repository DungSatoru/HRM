package tlu.finalproject.hrmanagement.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Entity
@Table(name = "overtime_records")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OvertimeRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "overtime_id")
    Long overtimeId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @Column(name = "overtime_start")
    LocalTime overtimeStart;

    @Column(name = "overtime_end")
    LocalTime overtimeEnd;

    @Column(name = "overtime_hour")
    Double overtimeHour;

    @Column(name = "overtime_pay")
    Double overtimePay;

    @Column(name = "month")
    String month;
}
