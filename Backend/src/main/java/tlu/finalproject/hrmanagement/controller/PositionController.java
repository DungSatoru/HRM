package tlu.finalproject.hrmanagement.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.DepartmentDTO;
import tlu.finalproject.hrmanagement.dto.PositionDTO;
import tlu.finalproject.hrmanagement.service.DepartmentService;
import tlu.finalproject.hrmanagement.service.PositionService;

import java.util.List;

@RestController
@RequestMapping("api/positions") // http://localhost:8080/api/positions
public class PositionController {
    private final PositionService positionService;

    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    @GetMapping
    public ResponseEntity<?> getAllPositions() {
        return ResponseEntity.ok(positionService.getAllPosition());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPositionById(@PathVariable Long id) {
        return ResponseEntity.ok(positionService.getPositionById(id));
    }

    @PostMapping
    public ResponseEntity<?> createPosition(@RequestBody PositionDTO userDTO) {
        return new ResponseEntity<>(positionService.createPosition(userDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePosition(@PathVariable Long id, @RequestBody PositionDTO positionDTO) {
        return ResponseEntity.ok(positionService.updatePosition(id, positionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePosition(@PathVariable Long id) {
        return ResponseEntity.ok(positionService.deletePosition(id));
    }
}
