package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.SalaryConfigurationDTO;
import tlu.finalproject.hrmanagement.dto.common.ApiResponse;
import tlu.finalproject.hrmanagement.dto.common.ResponseUtil;
import tlu.finalproject.hrmanagement.service.SalaryConfigurationService;

import java.util.List;

@RestController
@RequestMapping("/api/salary-config")
@RequiredArgsConstructor
public class SalaryConfigurationController {
    private final SalaryConfigurationService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SalaryConfigurationDTO>>> getAllSalaryConfig() {
        List<SalaryConfigurationDTO> salaryConfigs = service.getAllSalaryConfig();
        return ResponseUtil.success(salaryConfigs, "Lấy danh sách cấu hình lương thành công");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<SalaryConfigurationDTO>> getByUserId(@PathVariable Long userId) {
        SalaryConfigurationDTO salaryConfig = service.getByUserId(userId);
        if (salaryConfig == null) {
            return ResponseUtil.notFound("Không tìm thấy cấu hình lương cho người dùng với ID " + userId);
        }
        return ResponseUtil.success(salaryConfig, "Lấy thông tin cấu hình lương thành công");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SalaryConfigurationDTO>> createSalaryConfiguration(@RequestBody SalaryConfigurationDTO dto) {
        SalaryConfigurationDTO salaryConfigurationDTO = service.createSalaryConfiguration(dto);
        return ResponseUtil.created(salaryConfigurationDTO, "Tạo cấu hình lương thành công");
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<SalaryConfigurationDTO>> updateSalaryConfiguration(
            @PathVariable Long userId, @RequestBody SalaryConfigurationDTO dto) {
        SalaryConfigurationDTO salaryConfigurationDTO = service.updateSalaryConfiguration(userId, dto);
        return ResponseUtil.success(salaryConfigurationDTO, "Cập nhật cấu hình lương thành công");
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteByUserId(@PathVariable Long userId) {
        boolean deleted = service.deleteByUserId(userId);
        if (!deleted) {
            return ResponseUtil.notFound("Không tìm thấy cấu hình lương với ID " + userId);
        }
        return ResponseUtil.success(null, "Xóa cấu hình lương thành công");
    }
}
