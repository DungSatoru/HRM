package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.AttendanceDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface AttendanceService {
    String handleSocketAttendance(Long userId, LocalDateTime time); // Xử lý chấm công (gọi từ khuôn mặt nhận diện)
    List<AttendanceDTO> getAttendancesByDate(LocalDate date); // Lấy dữ liệu chấm công của toàn bộ nhân viên theo ngày
    List<AttendanceDTO> getAttendancesByUserAndDateRange(Long userId, LocalDate start, LocalDate end);
    AttendanceDTO getAttendanceById(Long id);
    AttendanceDTO updateAttendance(Long id, AttendanceDTO attendanceDTO);
    AttendanceDTO createAttendance(AttendanceDTO attendanceDTO);
    boolean deleteAttendance(Long id);
}
