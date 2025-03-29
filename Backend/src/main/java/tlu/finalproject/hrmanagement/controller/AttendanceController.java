package tlu.finalproject.hrmanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tlu.finalproject.hrmanagement.dto.AttendanceDTO;
import tlu.finalproject.hrmanagement.service.AttendanceService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping("/check")
    public ResponseEntity<String> checkAttendance(@RequestBody AttendanceDTO attendanceDTO) {
        LocalDateTime eventTime = LocalDateTime.parse(attendanceDTO.getTime(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String message = attendanceService.processAttendance(attendanceDTO.getUserId(), eventTime);
        return ResponseEntity.ok(message);
    }
}
