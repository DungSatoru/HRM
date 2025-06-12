package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.AttendanceByFaceDTO;
import tlu.finalproject.hrmanagement.dto.AttendanceDTO;
import tlu.finalproject.hrmanagement.dto.common.ApiResponse;
import tlu.finalproject.hrmanagement.dto.common.ResponseUtil;
import tlu.finalproject.hrmanagement.service.AttendanceService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @GetMapping()
    @PreAuthorize("hasAnyRole('HR')")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getAttendancesByDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceDTO> attendanceList = attendanceService.getAttendancesByDate(date);
        return ResponseUtil.success(attendanceList, "Lấy danh sách chấm công thành công");
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<AttendanceDTO>> getAttendanceById(@PathVariable Long id) {
        AttendanceDTO attendance = attendanceService.getAttendanceById(id);
        if (attendance == null) {
            return ResponseUtil.notFound("Không tìm thấy chấm công với ID " + id);
        }
        return ResponseUtil.success(attendance, "Lấy thông tin chấm công thành công");
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getAttendancesByUserAndDateRange(
            @PathVariable Long userId,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<AttendanceDTO> attendanceList = attendanceService.getAttendancesByUserAndDateRange(userId, start, end);
        return ResponseUtil.success(attendanceList, "Lấy danh sách chấm công của nhân viên thành công");
    }

    // Thêm dữ liệu chấm công mới
    @PostMapping()
    @PreAuthorize("hasAnyRole('HR')")
    public ResponseEntity<ApiResponse<AttendanceDTO>> createAttendance(@RequestBody AttendanceDTO attendanceDTO) {
        AttendanceDTO dto = attendanceService.createAttendance(attendanceDTO);
        return ResponseUtil.success(dto, "Thêm dữ liệu chấm công thành công");
    }


    // Sửa bản ghi chấm công
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR')")
    public ResponseEntity<ApiResponse<AttendanceDTO>> updateAttendance(@PathVariable Long id, @RequestBody AttendanceDTO attendanceDTO) {
        AttendanceDTO updatedAttendance = attendanceService.updateAttendance(id, attendanceDTO);
        if (updatedAttendance == null) {
            return ResponseUtil.notFound("Không tìm thấy chấm công với ID " + id);
        }
        return ResponseUtil.success(updatedAttendance, "Cập nhật dữ liệu chấm công thành công");
    }


    // Xóa dữ liệu chấm công theo ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR')")
    public ResponseEntity<ApiResponse<Void>> deleteAttendance(@PathVariable Long id) {
        boolean deleted = attendanceService.deleteAttendance(id);
        if (!deleted) {
            // Trả về lỗi nếu không tìm thấy dữ liệu để xóa
            return ResponseUtil.notFound("Không tìm thấy dữ liệu chấm công với ID " + id);
        }
        // Trả về thành công nếu xóa thành công
        return ResponseUtil.success(null, "Xóa dữ liệu chấm công thành công");
    }



    // TEST CHẤM CÔNG THỦ CÔNG VỚI DỮ LIỆU GỬI VÀO ĐỂ CHECK XEM LÀ CHECKIN HAY SẼ CHECKOUT
    @PostMapping("/check")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<String>> checkAttendance(@RequestBody AttendanceByFaceDTO attendanceDTO) {
        LocalDateTime eventTime = LocalDateTime.parse(attendanceDTO.getTime(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String message = attendanceService.handleSocketAttendance(attendanceDTO.getUserId(), eventTime);
        return ResponseUtil.success(message, "Chấm công thành công");
    }
}
