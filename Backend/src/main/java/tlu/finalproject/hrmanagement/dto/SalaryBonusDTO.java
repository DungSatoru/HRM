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
public class SalaryBonusDTO {
    Long bonusId;
    Long userId;
    String bonusType;
    Double amount;
    LocalDate bonusDate;
}
