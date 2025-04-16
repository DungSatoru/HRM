package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.AttendanceDTO;
import tlu.finalproject.hrmanagement.exception.BadRequestException;
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
    private final ModelMapper modelMapper;

    @Override
    public List<AttendanceDTO> getAttendancesByDate(LocalDate date) {
        if (date == null) {
            throw new BadRequestException("Ngày không được để trống.");
        }
        return attendanceRepository.findByDate(date);
    }


    @Override
    public AttendanceDTO getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dữ liệu chấm công"));
        return modelMapper.map(attendance, AttendanceDTO.class);
    }


    @Override
    public List<AttendanceDTO> getAttendancesByUserAndDateRange(Long userId, LocalDate start, LocalDate end) {
        if (userId == null || start == null || end == null) {
            throw new BadRequestException("Thiếu thông tin truy vấn (ID nhân viên, ngày bắt đầu, ngày kết thúc).");
        }
        return attendanceRepository.findAttendancesByUserAndDateRange(userId, start, end);
    }

    @Override
    public String processAttendance(Long userId, LocalDateTime time) {
        if (userId == null || time == null) {
            throw new BadRequestException("Thiếu thông tin chấm công.");
        }

        LocalDate date = time.toLocalDate();
        LocalTime eventTime = time.toLocalTime();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + userId));

        List<Attendance> todayRecords = attendanceRepository.findAttendancesByUserAndDate(userId, date);

        if (todayRecords.isEmpty()) {
            Attendance newAttendance = new Attendance();
            newAttendance.setUser(user);
            newAttendance.setDate(date);
            newAttendance.setCheckIn(eventTime);
            attendanceRepository.save(newAttendance);
            return "Đã ghi nhận check-in lúc " + eventTime;
        } else {
            Attendance lastRecord = todayRecords.get(todayRecords.size() - 1);
            if (lastRecord.getCheckOut() == null) {
                lastRecord.setCheckOut(eventTime);
                attendanceRepository.save(lastRecord);
                return "Đã ghi nhận check-out lúc " + eventTime;
            } else {
                Attendance newAttendance = new Attendance();
                newAttendance.setUser(user);
                newAttendance.setDate(date);
                newAttendance.setCheckIn(eventTime);
                attendanceRepository.save(newAttendance);
                return "Đã ghi nhận check-in mới lúc " + eventTime;
            }
        }
    }

    @Override
    public String checkIn(AttendanceDTO attendanceDTO) {
        if (attendanceDTO.getUserId() == null || attendanceDTO.getDate() == null || attendanceDTO.getCheckIn() == null) {
            throw new BadRequestException("Thiếu thông tin check-in (ID, ngày, giờ).");
        }

        User user = userRepository.findById(attendanceDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + attendanceDTO.getUserId()));

        List<Attendance> todayRecords = attendanceRepository.findAttendancesByUserAndDate(attendanceDTO.getUserId(), attendanceDTO.getDate());

        if (todayRecords.isEmpty()) {
            Attendance newAttendance = new Attendance();
            newAttendance.setUser(user);
            newAttendance.setDate(attendanceDTO.getDate());
            newAttendance.setCheckIn(attendanceDTO.getCheckIn());
            attendanceRepository.save(newAttendance);
            return "Đã ghi nhận check-in lúc " + attendanceDTO.getCheckIn();
        }

        return "Nhân viên " + user.getFullName() + " đã check-in hôm nay.";
    }

    @Override
    public String checkOut(AttendanceDTO attendanceDTO) {
        if (attendanceDTO.getUserId() == null || attendanceDTO.getDate() == null || attendanceDTO.getCheckOut() == null) {
            throw new BadRequestException("Thiếu thông tin check-out (ID, ngày, giờ).");
        }

        Long userId = attendanceDTO.getUserId();
        LocalTime checkOutTime = attendanceDTO.getCheckOut();
        LocalDate date = attendanceDTO.getDate();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + userId));

        List<Attendance> todayRecords = attendanceRepository.findAttendancesByUserAndDate(userId, date);

        if (!todayRecords.isEmpty()) {
            Attendance lastRecord = todayRecords.get(todayRecords.size() - 1);

            if (lastRecord.getCheckOut() == null) {
                lastRecord.setCheckOut(checkOutTime);
                attendanceRepository.save(lastRecord);

                LocalTime overtimeStartTime = LocalTime.of(17, 30);

                if (checkOutTime.isAfter(overtimeStartTime)) {
                    String message = processOvertime(userId, overtimeStartTime, checkOutTime);
                    return "Đã check-out và " + message;
                }

                return "Đã ghi nhận check-out lúc " + checkOutTime;
            }
        }

        return "Không tìm thấy bản ghi check-in nào hôm nay.";
    }

    @Override
    public String processOvertime(Long userId, LocalTime overtimeStart, LocalTime overtimeEnd) {
        if (userId == null || overtimeStart == null || overtimeEnd == null) {
            throw new BadRequestException("Thiếu thông tin làm thêm giờ.");
        }

        if (overtimeEnd.isBefore(overtimeStart)) {
            throw new BadRequestException("Thời gian kết thúc làm thêm không được trước thời gian bắt đầu.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + userId));

        SalaryConfiguration salaryConfiguration = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cấu hình lương của nhân viên với ID: " + userId));

        long overtimeMinutes = Duration.between(overtimeStart, overtimeEnd).toMinutes();
        double overtimeHours = overtimeMinutes / 60.0;

        double basicSalary = salaryConfiguration.getBasicSalary();
        double hourSalary = basicSalary / 22 / 8;
        double overtimeRate = salaryConfiguration.getOvertimeRate();
        double overtimePay = overtimeHours * overtimeRate * hourSalary;

        OvertimeRecord overtimeRecord = new OvertimeRecord();
        overtimeRecord.setUser(user);
        overtimeRecord.setOvertimeStart(overtimeStart);
        overtimeRecord.setOvertimeEnd(overtimeEnd);
        overtimeRecord.setOvertimeHour(overtimeHours);
        overtimeRecord.setOvertimePay(overtimePay);

        overtimeRecordRepository.save(overtimeRecord);

        return "đã ghi nhận làm thêm giờ thành công (" + String.format("%.2f", overtimeHours) + " giờ).";
    }
}
