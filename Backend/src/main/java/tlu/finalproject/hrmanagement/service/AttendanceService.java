package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.AttendanceDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface AttendanceService {
    // Xử lý chấm công (gọi từ khuôn mặt nhận diện)
    String handleSocketAttendance(Long userId, LocalDateTime time);

    // Xử lý tính giờ làm thêm (tính và lưu vào bảng overtime_records)
    String processOvertime(Long userId, LocalDate date, LocalTime overtimeStart, LocalTime overtimeEnd);

    // Lấy dữ liệu chấm công của toàn bộ nhân viên theo ngày
    List<AttendanceDTO> getAttendancesByDate(LocalDate date);

    List<AttendanceDTO> getAttendancesByUserAndDateRange(Long userId, LocalDate start, LocalDate end);

    AttendanceDTO getAttendanceById(Long id);

    AttendanceDTO updateAttendance(Long id, AttendanceDTO attendanceDTO);

    AttendanceDTO createAttendance(AttendanceDTO attendanceDTO);

    boolean deleteAttendance(Long id);
}
