package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.RoleDTO;
import tlu.finalproject.hrmanagement.dto.common.ApiResponse;
import tlu.finalproject.hrmanagement.dto.common.ResponseUtil;
import tlu.finalproject.hrmanagement.service.RoleService;

import java.util.List;

@RestController
@RequestMapping("api/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<List<RoleDTO>>> getAllRoles() {
        List<RoleDTO> roles = roleService.getAllRole();
        return ResponseUtil.success(roles, "Lấy danh sách vai trò thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<RoleDTO>> getRoleById(@PathVariable Long id) {
        RoleDTO role = roleService.getRoleById(id);
        if (role == null) {
            return ResponseUtil.notFound("Không tìm thấy vai trò với ID " + id);
        }
        return ResponseUtil.success(role, "Lấy thông tin vai trò thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoleDTO>> createRole(@RequestBody RoleDTO roleDTO) {
        RoleDTO createdRole = roleService.createRole(roleDTO);
        return ResponseUtil.created(createdRole, "Tạo vai trò mới thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoleDTO>> updateRole(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
        RoleDTO updatedRole = roleService.updateRole(id, roleDTO);
        if (updatedRole == null) {
            return ResponseUtil.notFound("Không tìm thấy vai trò với ID " + id);
        }
        return ResponseUtil.success(updatedRole, "Cập nhật vai trò thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Long id) {
        boolean deleted = roleService.deleteRole(id);
        if (!deleted) {
            return ResponseUtil.notFound("Không tìm thấy vai trò với ID " + id);
        }
        return ResponseUtil.success(null, "Xóa vai trò thành công");
    }
}
