package tlu.finalproject.hrmanagement.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalaryDeductionDTO {
    Long deductionId;
    Long userId;
    String deductionType;
    Double amount;
    LocalDate deductionDate;
}
