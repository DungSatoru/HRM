package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.SalaryDeductionDTO;
import tlu.finalproject.hrmanagement.service.SalaryDeductionService;

import java.util.List;

@RestController
@RequestMapping("/api/salary-deductions")
@RequiredArgsConstructor
public class SalaryDeductionController {

    private final SalaryDeductionService service;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SalaryDeductionDTO>> getAllByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getAllByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<SalaryDeductionDTO> create(@RequestBody SalaryDeductionDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaryDeductionDTO> update(@PathVariable Long id, @RequestBody SalaryDeductionDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.ok(service.delete(id));
    }
}
