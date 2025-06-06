package tlu.finalproject.hrmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tlu.finalproject.hrmanagement.dto.EmployeeDTO;
import tlu.finalproject.hrmanagement.dto.common.ApiResponse;
import tlu.finalproject.hrmanagement.dto.common.ResponseUtil;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.service.FileStorageService;
import tlu.finalproject.hrmanagement.service.UserService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final FileStorageService fileStorageService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getAllUsers() {
        List<EmployeeDTO> users = userService.getAllUsers();
        return ResponseUtil.success(users, "Lấy danh sách nhân viên thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getUserById(@PathVariable Long id) {
        EmployeeDTO user = userService.getUserById(id);
        if (user == null) {
            return ResponseUtil.notFound("Không tìm thấy nhân viên với ID " + id);
        }
        return ResponseUtil.success(user, "Lấy thông tin nhân viên thành công");
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getUsersByDepartment(@PathVariable Long departmentId) {
        List<EmployeeDTO> users = userService.getUsersByDepartmentId(departmentId);
        return ResponseUtil.success(users, "Lấy danh sách nhân viên theo phòng ban thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HR')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> createUser(
            @RequestPart("data") String employeeJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        EmployeeDTO employeeDTO = objectMapper.readValue(employeeJson, EmployeeDTO.class); // 👈 parse JSON

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileStorageService.saveFile(imageFile); // Lưu file ảnh và lấy đường dẫn
            employeeDTO.setProfileImageUrl(imageUrl); // Gán lại URL ảnh vào DTO
        }
        EmployeeDTO createdUser = userService.createUser(employeeDTO);
        return ResponseUtil.created(createdUser, "Tạo nhân viên mới thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateUser(
            @PathVariable Long id,
            @RequestPart("data") String employeeJson, // nhận raw JSON
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        EmployeeDTO employeeDTO = objectMapper.readValue(employeeJson, EmployeeDTO.class); // parse JSON

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileStorageService.saveFile(imageFile);
            employeeDTO.setProfileImageUrl(imageUrl);
        }

        EmployeeDTO updatedUser = userService.updateUser(id, employeeDTO);
        if (updatedUser == null) {
            return ResponseUtil.notFound("Không tìm thấy nhân viên với ID " + id);
        }
        return ResponseUtil.success(updatedUser, "Cập nhật nhân viên thành công");
    }

    @PostMapping("/{id}/assign-role")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> assignRole(@PathVariable Long id, @RequestParam Long roleId) {
        try {
            boolean success = userService.assignRole(id, roleId);
            if (!success) {
                return ResponseUtil.notFound("Không thể cập nhật vai trò cho nhân viên");
            }
            return ResponseUtil.success("Cập nhật quyền nhân viên thành công", "Cập nhật quyền nhân viên thành công");
        } catch (ResourceNotFoundException e) {
            return ResponseUtil.notFound("Không tìm thấy nhân viên hoặc vai trò");
        }
    }
}
