package tlu.finalproject.hrmanagement.projection;

import java.time.LocalDate;
import java.time.LocalTime;

public interface OvertimeRecordProjection {
    Long getOvertimeId();
    Long getUserId();
    LocalTime getOvertimeStart();
    LocalTime getOvertimeEnd();
    Double getOvertimeHour();
    Double getOvertimePay();
    LocalDate getOvertimeDate();
    String getMonth();
}
