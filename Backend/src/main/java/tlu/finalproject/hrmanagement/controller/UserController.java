package tlu.finalproject.hrmanagement.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.EmployeeDTO;
import tlu.finalproject.hrmanagement.service.UserService;

import java.util.List;

@RestController
@RequestMapping("api/users") // http://localhost:8080/api/users
public class UserController {
    private final UserService userService;

    // Constructor có tham số để Spring Boot inject UserService
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<EmployeeDTO>> getUsersByDepartment(@PathVariable Long departmentId) {
        List<EmployeeDTO> users = userService.getUsersByDepartmentId(departmentId);
        return ResponseEntity.ok(users);
    }


    @PostMapping
    public ResponseEntity<EmployeeDTO> createUser(@RequestBody EmployeeDTO employeeDTO) {
        // Gọi service để thêm User
        EmployeeDTO createdUser = userService.createUser(employeeDTO);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateUser(@PathVariable Long id, @RequestBody EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(userService.updateUser(id, employeeDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
