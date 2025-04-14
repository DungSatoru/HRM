package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.AttendanceDTO;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.Attendance;
import tlu.finalproject.hrmanagement.model.OvertimeRecord;
import tlu.finalproject.hrmanagement.model.SalaryConfiguration;
import tlu.finalproject.hrmanagement.model.User;
import tlu.finalproject.hrmanagement.repository.AttendanceRepository;
import tlu.finalproject.hrmanagement.repository.OvertimeRecordRepository;
import tlu.finalproject.hrmanagement.repository.SalaryConfigurationRepository;
import tlu.finalproject.hrmanagement.repository.UserRepository;
import tlu.finalproject.hrmanagement.service.AttendanceService;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final SalaryConfigurationRepository salaryConfigurationRepository;
    private final OvertimeRecordRepository overtimeRecordRepository;
    private final UserRepository userRepository;


    @Override
    public List<AttendanceDTO> getAttendancesByDate(LocalDate date) {
        return  attendanceRepository.findByDate(date);
    }

    @Override
    public List<AttendanceDTO> getAttendancesByUserAndDateRange(Long userId, LocalDate start, LocalDate end) {
        return attendanceRepository.findAttendancesByUserAndDateRange(userId, start, end);
    }

    @Override
    public String processAttendance(Long userId, LocalDateTime time) {
        LocalDate date = time.toLocalDate();
        LocalTime eventTime = time.toLocalTime();

        // Kiểm tra nhân viên
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy tất cả bản ghi chấm công của nhân viên trong ngày
        List<Attendance> todayRecords = attendanceRepository.findAttendancesByUserAndDate(userId, date);

        if (todayRecords.isEmpty()) {
            // Nếu chưa có bản ghi hôm nay ==> Check in mới
            Attendance newAttendance = new Attendance();
            newAttendance.setUser(user);
            newAttendance.setDate(date);
            newAttendance.setCheckIn(eventTime);
            attendanceRepository.save(newAttendance);
            return "Check-in recorded at " + eventTime;
        } else {
            Attendance lastRecord = todayRecords.get(0);

            if (lastRecord.getCheckOut() == null) {
                // Nếu bản ghi gần nhất chưa có check out => Check out
                lastRecord.setCheckOut(eventTime);
                attendanceRepository.save(lastRecord);
                return "Check-out recorded at " + eventTime;
            } else {
                // Nếu bản ghi gần nhất đã có check out => Check in mới
                Attendance newAttendance = new Attendance();
                newAttendance.setUser(user);
                newAttendance.setDate(date);
                newAttendance.setCheckIn(eventTime);
                attendanceRepository.save(newAttendance);
                return "New Check-in recorded at " + eventTime;
            }
        }
    }

    @Override
    public String checkIn(AttendanceDTO attendanceDTO) {
        User user = userRepository.findById(attendanceDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + attendanceDTO.getUserId()));
        // Lấy tất cả bản ghi chấm công của nhân viên trong ngày
        List<Attendance> todayRecords = attendanceRepository.findAttendancesByUserAndDate(attendanceDTO.getUserId(), attendanceDTO.getDate());

        if (todayRecords.isEmpty()) {
            // Nếu chưa có bản ghi hôm nay ==> Check in mới
            Attendance newAttendance = new Attendance();
            newAttendance.setUser(user);
            newAttendance.setDate(attendanceDTO.getDate());
            newAttendance.setCheckIn(attendanceDTO.getCheckIn());
            attendanceRepository.save(newAttendance);
            return "Check-in recorded at " + attendanceDTO.getCheckIn();
        }
        return "Check-in success for user " + user.getFullName();
    }

    @Override
    public String checkOut(AttendanceDTO attendanceDTO) {
        Long userId = attendanceDTO.getUserId();
        LocalTime checkOutTime = attendanceDTO.getCheckOut();

        // Lấy thông tin của nhân viên và bản ghi chấm công
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + userId));

        // Lấy tất cả các bản ghi attendance của nhân viên trong ngày
        LocalDate date = attendanceDTO.getDate();
        List<Attendance> todayRecords = attendanceRepository.findAttendancesByUserAndDate(userId, date);

        if (!todayRecords.isEmpty()) {
            Attendance lastRecord = todayRecords.get(todayRecords.size() - 1);

            // Nếu nhân viên đã có check-in và chưa có check-out
            if (lastRecord.getCheckOut() == null) {
                // Cập nhật giờ check-out
                lastRecord.setCheckOut(checkOutTime);
                attendanceRepository.save(lastRecord);

                // Kiểm tra giờ làm thêm
                LocalTime overtimeStartTime = LocalTime.of(17, 30); // Giới hạn giờ làm thêm bắt đầu từ 17h30

                // Chỉ tính làm thêm nếu giờ check-out sau 17h30
                if (checkOutTime.isAfter(overtimeStartTime)) {
                    LocalTime overtimeStart = overtimeStartTime;
                    LocalTime overtimeEnd = checkOutTime;

                    // Gọi processOvertime để tính và lưu giờ làm thêm
                    String message = processOvertime(userId, overtimeStart, overtimeEnd);

                    return "Check-out recorded and " + message;
                }

                return "Check-out recorded";
            }
        }
        return "No check-in record found for today";
    }

    @Override
    public String processOvertime(Long userId, LocalTime overtimeStart, LocalTime overtimeEnd) {
        // Lấy thông tin người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + userId));

        // Lấy cấu hình lương của nhân viên
        SalaryConfiguration salaryConfiguration = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Salary configuration not found for Employee with ID: " + userId));

        // Tính toán số giờ làm thêm
//        long overtimeHours = Duration.between(overtimeStart, overtimeEnd).toHours(); // Chuyển đổi thời gian thành số giờ
        long overtimeMinutes = Duration.between(overtimeStart, overtimeEnd).toMinutes();
        double overtimeHours = overtimeMinutes / 60.0;

        // Tính toán tiền làm thêm
        double basicSalary = salaryConfiguration.getBasicSalary();
        double hourSalary = basicSalary / 22 / 8;
        double overtimeRate = salaryConfiguration.getOvertimeRate();
        double overtimePay = overtimeHours * overtimeRate * hourSalary; // Tiền làm thêm = số giờ * rate

        // Tạo bản ghi làm thêm giờ
        OvertimeRecord overtimeRecord = new OvertimeRecord();
        overtimeRecord.setUser(user);
        overtimeRecord.setOvertimeStart(overtimeStart);  // Thời gian bắt đầu
        overtimeRecord.setOvertimeEnd(overtimeEnd);      // Thời gian kết thúc
        overtimeRecord.setOvertimeHour((double) overtimeHours);       // Số giờ làm thêm
        overtimeRecord.setOvertimePay(overtimePay);                    // Tiền làm thêm

        // Lưu vào cơ sở dữ liệu
        overtimeRecordRepository.save(overtimeRecord);

        return "Overtime recorded successfully";
    }
}
