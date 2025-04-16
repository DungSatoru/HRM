package tlu.finalproject.hrmanagement.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.EmployeeDTO;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
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
    public ResponseEntity<?> getAllUsers() {
        List<EmployeeDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        EmployeeDTO user = userService.getUserById(id);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id " + id);  // Ném ResourceNotFoundException
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<?> getUsersByDepartment(@PathVariable Long departmentId) {
        List<EmployeeDTO> users = userService.getUsersByDepartmentId(departmentId);
        return ResponseEntity.ok(users);
    }


    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody EmployeeDTO employeeDTO) {
        return new ResponseEntity<>(userService.createUser(employeeDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(userService.updateUser(id, employeeDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
