package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.SalaryBonusDTO;
import tlu.finalproject.hrmanagement.service.SalaryBonusService;

import java.util.List;

@RestController
@RequestMapping("/api/salary-bonuses")
@RequiredArgsConstructor
public class SalaryBonusController {

    private final SalaryBonusService service;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SalaryBonusDTO>> getAllByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getAllByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<SalaryBonusDTO> create(@RequestBody SalaryBonusDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaryBonusDTO> update(@PathVariable Long id, @RequestBody SalaryBonusDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.ok(service.delete(id));
    }
}
