package tlu.finalproject.hrmanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.DepartmentDTO;
import tlu.finalproject.hrmanagement.dto.common.ApiResponse;
import tlu.finalproject.hrmanagement.dto.common.ResponseUtil;
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
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getAllDepartments() {
        List<DepartmentDTO> departments = departmentService.getAllDepartment();
        return ResponseUtil.success(departments, "Lấy danh sách phòng ban thành công");
    }

    @GetMapping("/{departmentId}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> getDepartmentById(@PathVariable Long departmentId) {
        DepartmentDTO department = departmentService.getDepartmentById(departmentId);
        if (department == null) {
            return ResponseUtil.notFound("Không tìm thấy phòng ban với ID " + departmentId);
        }
        return ResponseUtil.success(department, "Lấy thông tin phòng ban thành công");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(@RequestBody DepartmentDTO departmentDTO) {
        DepartmentDTO createdDepartment = departmentService.createDepartment(departmentDTO);
        return ResponseUtil.created(createdDepartment, "Tạo phòng ban mới thành công");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(@PathVariable Long id, @RequestBody DepartmentDTO departmentDTO) {
        DepartmentDTO updatedDepartment = departmentService.updateDepartment(id, departmentDTO);
        if (updatedDepartment == null) {
            return ResponseUtil.notFound("Không tìm thấy phòng ban với ID " + id);
        }
        return ResponseUtil.success(updatedDepartment, "Cập nhật phòng ban thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        boolean deleted = departmentService.deleteDepartment(id);
        if (!deleted) {
            return ResponseUtil.notFound("Không tìm thấy phòng ban với ID " + id);
        }
        return ResponseUtil.success(null, "Xóa phòng ban thành công");
    }
}
