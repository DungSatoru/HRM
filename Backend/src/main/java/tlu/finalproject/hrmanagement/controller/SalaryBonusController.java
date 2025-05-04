package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.SalaryBonusDTO;
import tlu.finalproject.hrmanagement.dto.common.ApiResponse;
import tlu.finalproject.hrmanagement.dto.common.ResponseUtil;
import tlu.finalproject.hrmanagement.service.SalaryBonusService;

import java.util.List;

@RestController
@RequestMapping("/api/salary-bonuses")
@RequiredArgsConstructor
public class SalaryBonusController {

    private final SalaryBonusService service;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<SalaryBonusDTO>>> getAllByUserId(@PathVariable Long userId) {
        List<SalaryBonusDTO> salaryBonuses = service.getAllByUserId(userId);
        return ResponseUtil.success(salaryBonuses, "Lấy danh sách thưởng lương thành công");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SalaryBonusDTO>> create(@RequestBody SalaryBonusDTO dto) {
        SalaryBonusDTO createdSalaryBonus = service.create(dto);
        return ResponseUtil.created(createdSalaryBonus, "Tạo thưởng lương thành công");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SalaryBonusDTO>> update(@PathVariable Long id, @RequestBody SalaryBonusDTO dto) {
        SalaryBonusDTO updatedSalaryBonus = service.update(id, dto);
        if (updatedSalaryBonus == null) {
            return ResponseUtil.notFound("Không tìm thấy thưởng lương với ID " + id);
        }
        return ResponseUtil.success(updatedSalaryBonus, "Cập nhật thưởng lương thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        boolean deleted = service.delete(id);
        if (!deleted) {
            return ResponseUtil.notFound("Không tìm thấy thưởng lương với ID " + id);
        }
        return ResponseUtil.success(null, "Xóa thưởng lương thành công");
    }
}
