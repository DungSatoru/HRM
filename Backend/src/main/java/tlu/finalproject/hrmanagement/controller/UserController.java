package tlu.finalproject.hrmanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.EmployeeDTO;
import tlu.finalproject.hrmanagement.dto.common.ApiResponse;
import tlu.finalproject.hrmanagement.dto.common.ResponseUtil;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.service.UserService;

import java.util.List;

@RestController
@RequestMapping("api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getAllUsers() {
        List<EmployeeDTO> users = userService.getAllUsers();
        return ResponseUtil.success(users, "Lấy danh sách người dùng thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getUserById(@PathVariable Long id) {
        EmployeeDTO user = userService.getUserById(id);
        if (user == null) {
            return ResponseUtil.notFound("Không tìm thấy người dùng với ID " + id);
        }
        return ResponseUtil.success(user, "Lấy thông tin người dùng thành công");
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getUsersByDepartment(@PathVariable Long departmentId) {
        List<EmployeeDTO> users = userService.getUsersByDepartmentId(departmentId);
        return ResponseUtil.success(users, "Lấy danh sách người dùng theo phòng ban thành công");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeDTO>> createUser(@RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO createdUser = userService.createUser(employeeDTO);
        return ResponseUtil.created(createdUser, "Tạo người dùng mới thành công");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateUser(@PathVariable Long id, @RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO updatedUser = userService.updateUser(id, employeeDTO);
        if (updatedUser == null) {
            return ResponseUtil.notFound("Không tìm thấy người dùng với ID " + id);
        }
        return ResponseUtil.success(updatedUser, "Cập nhật người dùng thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        if (!deleted) {
            return ResponseUtil.notFound("Không tìm thấy người dùng với ID " + id);
        }
        return ResponseUtil.success(null, "Xóa người dùng thành công");
    }
}
