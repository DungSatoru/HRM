package tlu.finalproject.hrmanagement.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Duration;
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
    @JoinColumn(name = "attendance_id")
    Attendance attendance;

    @Column(name = "start_time")
    LocalTime startTime;

    @Column(name = "end_time")
    LocalTime endTime;

    @Column(name = "day_hours")
    Double dayHours;  // Số giờ OT ngày (17h-22h)

    @Column(name = "night_hours")
    Double nightHours; // Số giờ OT đêm (sau 22h)
}
