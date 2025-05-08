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
public class LateDeductionDTO {
    Long userId;
    String fullName;
    LocalDate date;
    LocalTime checkIn;
    int minutesLate;
    int deductedMinutes;
    double deductionAmount;
}
