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
public class OvertimeRecordDTO {
    Long overtimeId;
    Long userId;
    LocalTime overtimeStart;
    LocalTime overtimeEnd;
    Double overtimeHour;
    Double overtimePay;
    LocalDate overtimeDate;
    String month;
}
