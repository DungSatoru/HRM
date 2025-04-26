package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.service.SalaryCalculationService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/salaries")
@RequiredArgsConstructor
public class SalaryCalculationController {

    private final SalaryCalculationService salaryCalculationService;

    /**
     * Tính toán và lưu Salary Slip cho nhân viên
     *
     * @param userId ID của nhân viên
     * @param month Tháng tính lương (yyyy-MM format)
     * @return Message thành công
     */
    @PostMapping("/calculate")
    public ResponseEntity<String> calculateAndSaveSalarySlip(
            @RequestParam Long userId,
            @RequestParam String month
    ) {
        // Chuyển từ "2025-04" -> "2025-04-01"
        LocalDate localDate = LocalDate.parse(month + "-01");
        salaryCalculationService.calculateAndSaveSalarySlip(userId, localDate);
        return ResponseEntity.ok("Tính toán và lưu Salary Slip thành công cho nhân viên ID: " + userId + " tháng: " + month);
    }

}
