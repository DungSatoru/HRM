package tlu.finalproject.hrmanagement.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.DepartmentDTO;
import tlu.finalproject.hrmanagement.dto.EmployeeByDepartmentDTO;
import tlu.finalproject.hrmanagement.service.DepartmentService;

import java.util.List;

@RestController
@RequestMapping("api/departments") // http://localhost:8080/api/departments
public class DepartmentController {
    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<?> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartment());
    }

    @GetMapping("/{departmentId}")
    public ResponseEntity<?> getUserById(@PathVariable Long departmentId) {
        return ResponseEntity.ok(departmentService.getDepartmentById(departmentId));
    }

    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody DepartmentDTO userDTO) {
        return new ResponseEntity<>(departmentService.createDepartment(userDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long id, @RequestBody DepartmentDTO departmentDTO) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, departmentDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
}
