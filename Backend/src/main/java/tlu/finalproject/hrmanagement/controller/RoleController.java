package tlu.finalproject.hrmanagement.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.PositionDTO;
import tlu.finalproject.hrmanagement.service.PositionService;
import tlu.finalproject.hrmanagement.service.RoleService;

@RestController
@RequestMapping("api/roles") // http://localhost:8080/api/roles
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<?> getAllPositions() {
        return ResponseEntity.ok(roleService.getAllRole());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPositionById(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @PostMapping
    public ResponseEntity<?> createPosition(@RequestBody PositionDTO userDTO) {
        return new ResponseEntity<>(roleService.createRole(userDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePosition(@PathVariable Long id, @RequestBody PositionDTO positionDTO) {
        return ResponseEntity.ok(roleService.updateRole(id, positionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePosition(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.deleteRole(id));
    }
}
