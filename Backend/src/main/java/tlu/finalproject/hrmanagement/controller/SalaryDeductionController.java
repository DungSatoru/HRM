package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.SalaryDeductionDTO;
import tlu.finalproject.hrmanagement.dto.common.ApiResponse;
import tlu.finalproject.hrmanagement.dto.common.ResponseUtil;
import tlu.finalproject.hrmanagement.service.SalaryDeductionService;

import java.util.List;

@RestController
@RequestMapping("/api/salary-deductions")
@RequiredArgsConstructor
public class SalaryDeductionController {

    private final SalaryDeductionService service;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<SalaryDeductionDTO>>> getAllByUserId(@PathVariable Long userId) {
        List<SalaryDeductionDTO> deductions = service.getAllByUserId(userId);
        return ResponseUtil.success(deductions, "Lấy danh sách khoản giảm trừ thành công");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SalaryDeductionDTO>> create(@RequestBody SalaryDeductionDTO dto) {
        SalaryDeductionDTO createdDeduction = service.create(dto);
        return ResponseUtil.created(createdDeduction, "Tạo khoản giảm trừ thành công");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SalaryDeductionDTO>> update(@PathVariable Long id, @RequestBody SalaryDeductionDTO dto) {
        SalaryDeductionDTO updatedDeduction = service.update(id, dto);
        return ResponseUtil.success(updatedDeduction, "Cập nhật khoản giảm trừ thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        boolean deleted = service.delete(id);
        if (!deleted) {
            ResponseUtil.notFound("Không tìm thấy khấu trừ với ID " + id);
        }
        return ResponseUtil.success(null, "Xóa khoản giảm trừ thành công");
    }
}
