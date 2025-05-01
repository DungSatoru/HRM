package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.AttendanceByFaceDTO;
import tlu.finalproject.hrmanagement.dto.AttendanceDTO;
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
    public ResponseEntity<?> getAttendancesByDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceDTO> attendanceList = attendanceService.getAttendancesByDate(date);
        return ResponseEntity.ok(attendanceList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAttendanceById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAttendancesByUserAndDateRange(
            @PathVariable Long userId,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<AttendanceDTO> attendanceList = attendanceService.getAttendancesByUserAndDateRange(userId, start, end);
        return ResponseEntity.ok(attendanceList);
    }

    // Thêm dữ liệu chấm công mới
    @PostMapping()
    public ResponseEntity<?> createAttendance(@RequestBody AttendanceDTO attendanceDTO) {
        String message = attendanceService.createAttendance(attendanceDTO);
        return ResponseEntity.ok(message);
    }

    // Xóa dữ liệu chấm công theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long id) {
        String message = attendanceService.deleteAttendance(id);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttendance(@PathVariable Long id, @RequestBody AttendanceDTO attendanceDTO) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, attendanceDTO));
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkAttendance(@RequestBody AttendanceByFaceDTO attendanceDTO) {
        LocalDateTime eventTime = LocalDateTime.parse(attendanceDTO.getTime(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String message = attendanceService.handleSocketAttendance(attendanceDTO.getUserId(), eventTime);
        return ResponseEntity.ok(message);
    }
}
