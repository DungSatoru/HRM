package tlu.finalproject.hrmanagement.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OvertimeDTO {
    Long userId;
    LocalDateTime overtimeStart;
    LocalDateTime overtimeEnd;
    Double overtimeHours;
    Double overtimePay;
    LocalDate overtimeDate;
}
