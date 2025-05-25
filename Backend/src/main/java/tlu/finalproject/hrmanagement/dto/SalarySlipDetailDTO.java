package tlu.finalproject.hrmanagement.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalarySlipDetailDTO {
    SalarySlipDTO salarySlip;                // thông tin tổng hợp phiếu lương
    List<SalaryBonusDTO> bonusDetails;       // chi tiết từng khoản thưởng
    List<SalaryDeductionDTO> deductionDetails; // chi tiết từng khoản khấu trừ
}