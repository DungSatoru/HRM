package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.SalarySlipDTO;
import tlu.finalproject.hrmanagement.dto.SalarySlipDetailDTO;
import tlu.finalproject.hrmanagement.dto.common.ApiResponse;
import tlu.finalproject.hrmanagement.dto.common.ResponseUtil;
import tlu.finalproject.hrmanagement.service.SalaryCalculationService;
import tlu.finalproject.hrmanagement.service.SalarySlipService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/salaries")
@RequiredArgsConstructor
public class SalarySlipController {

    private final SalaryCalculationService salaryCalculationService;
    private final SalarySlipService salarySlipService;

    @GetMapping()
    @PreAuthorize("hasAnyRole('HR')")
    public ResponseEntity<ApiResponse<List<SalarySlipDTO>>> getSalarySlipsByMonth(@RequestParam String month) {
        return ResponseUtil.success(salarySlipService.getAllSalarySlipsByMonth(month), "Lấy danh sách bảng lương tháng " + month + " thành công");
    }

    @GetMapping("/employee/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<SalarySlipDetailDTO>> getSalarySlipDetail(
            @PathVariable Long userId,
            @RequestParam String month) {
        SalarySlipDetailDTO dto = salarySlipService.getSalarySlipDetail(userId, month);
        if (dto == null) {
            return ResponseUtil.notFound("Không tìm thấy bảng lương cho nhân viên ID " + userId + " trong tháng " + month);
        }
        return ResponseUtil.success(dto, "Lấy thông tin bảng lương của nhân viên ID " + userId + " tháng " + month + " thành công");
    }

    /**
     * Tính toán và lưu Salary Slip cho nhân viên
     *
     * @param userId ID của nhân viên
     * @param month  Tháng tính lương (yyyy-MM format)
     * @return Message thành công
     */
    @PostMapping("/calculate")
    @PreAuthorize("hasAnyRole('HR')")
    public ResponseEntity<ApiResponse<String>> calculateAndSaveSalarySlip(
            @RequestParam Long userId,
            @RequestParam String month
    ) {
        // Chuyển từ "2025-04" -> "2025-04-01"
        LocalDate localDate = LocalDate.parse(month + "-01");
        salaryCalculationService.calculateAndSaveSalarySlip(userId, localDate);
        String successMessage = "Tính toán và lưu Salary Slip thành công cho nhân viên ID: " + userId + " tháng: " + month;
        return ResponseUtil.success(successMessage, "Tính toán và lưu bảng lương thành công");
    }
}
