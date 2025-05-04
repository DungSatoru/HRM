package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.SalarySlipDetailDTO;
import tlu.finalproject.hrmanagement.service.SalaryCalculationService;
import tlu.finalproject.hrmanagement.service.SalarySlipService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/salaries")
@RequiredArgsConstructor
public class SalarySlipController {

    private final SalaryCalculationService salaryCalculationService;
    private final SalarySlipService salarySlipService;

    @GetMapping()
    public ResponseEntity<?> getSalarySlipsByMonth(@RequestParam String month) {
        return ResponseEntity.ok(salarySlipService.getAllSalarySlipsByMonth(month));
    }

    @GetMapping("/employee/{userId}")
    public ResponseEntity<SalarySlipDetailDTO> getSalarySlipDetail(
            @PathVariable Long userId,
            @RequestParam String month) {
        SalarySlipDetailDTO dto = salarySlipService.getSalarySlipDetail(userId, month);
        return ResponseEntity.ok(dto);
    }

    /**
     * Tính toán và lưu Salary Slip cho nhân viên
     *
     * @param userId ID của nhân viên
     * @param month  Tháng tính lương (yyyy-MM format)
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
