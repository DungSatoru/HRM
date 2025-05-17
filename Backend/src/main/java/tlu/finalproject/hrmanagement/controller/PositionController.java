package tlu.finalproject.hrmanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.PositionDTO;
import tlu.finalproject.hrmanagement.dto.common.ApiResponse;
import tlu.finalproject.hrmanagement.dto.common.ResponseUtil;
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
    public ResponseEntity<ApiResponse<List<PositionDTO>>> getAllPositions() {
        List<PositionDTO> positions = positionService.getAllPosition();
        return ResponseUtil.success(positions, "Lấy danh sách chức vụ thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PositionDTO>> getPositionById(@PathVariable Long id) {
        PositionDTO position = positionService.getPositionById(id);
        if (position == null) {
            return ResponseUtil.notFound("Không tìm thấy chức vụ với ID " + id);
        }
        return ResponseUtil.success(position, "Lấy thông tin chức vụ thành công");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PositionDTO>> createPosition(@RequestBody PositionDTO positionDTO) {
        PositionDTO createdPosition = positionService.createPosition(positionDTO);
        return ResponseUtil.created(createdPosition, "Thêm chức vụ mới thành công");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PositionDTO>> updatePosition(@PathVariable Long id, @RequestBody PositionDTO positionDTO) {
        PositionDTO updatedPosition = positionService.updatePosition(id, positionDTO);
        if (updatedPosition == null) {
            return ResponseUtil.notFound("Không tìm thấy chức vụ với ID " + id);
        }
        return ResponseUtil.success(updatedPosition, "Cập nhật chức vụ thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePosition(@PathVariable Long id) {
        boolean deleted = positionService.deletePosition(id);
        if (!deleted) {
            return ResponseUtil.notFound("Không tìm thấy chức vụ với ID " + id);
        }
        return ResponseUtil.success(null, "Xóa chức vụ thành công");
    }
}
