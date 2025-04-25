package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.SalaryConfigurationDTO;
import tlu.finalproject.hrmanagement.service.SalaryConfigurationService;

import java.util.List;

@RestController
@RequestMapping("/api/salary-config")
@RequiredArgsConstructor
public class SalaryConfigurationController {
    private final SalaryConfigurationService service;

    @GetMapping
    public ResponseEntity<List<SalaryConfigurationDTO>> getAllSalaryConfig() {
        return ResponseEntity.ok(service.getAllSalaryConfig());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<SalaryConfigurationDTO> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<String> createSalaryConfiguration(@RequestBody SalaryConfigurationDTO dto) {
        String message = service.createSalaryConfiguration(dto);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<String> updateSalaryConfiguration(
            @PathVariable Long userId, @RequestBody SalaryConfigurationDTO dto) {
        String message = service.updateSalaryConfiguration(userId, dto);
        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteByUserId(@PathVariable Long userId) {
        String message = service.deleteByUserId(userId);
        return ResponseEntity.ok(message);
    }
}
