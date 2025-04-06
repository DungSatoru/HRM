package tlu.finalproject.hrmanagement.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OvertimeDTO {
    private Long userId;
    private LocalDateTime overtimeStart;
    private LocalDateTime overtimeEnd;
    private Double overtimeHours;
    private Double overtimePay;
}
