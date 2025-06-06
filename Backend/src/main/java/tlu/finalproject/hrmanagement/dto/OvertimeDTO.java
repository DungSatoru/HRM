package tlu.finalproject.hrmanagement.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OvertimeDTO {
    Long overtimeId;
    Long userId;
    LocalTime overtimeStart;
    LocalTime overtimeEnd;
    Double overtimeHours;
    Double overtimePay;
    LocalDate overtimeDate;
}
