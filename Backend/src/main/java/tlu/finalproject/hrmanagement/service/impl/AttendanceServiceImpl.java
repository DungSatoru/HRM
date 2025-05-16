package tlu.finalproject.hrmanagement.service.impl;

import jakarta.transaction.Transactional;
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

import java.time.*;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    // Constants
    private static final LocalTime STANDARD_END_TIME = LocalTime.of(17, 30);
    private static final int WORKING_DAYS_PER_MONTH = 22;
    private static final int WORKING_HOURS_PER_DAY = 8;

    // Repositories
    private final AttendanceRepository attendanceRepository;
    private final SalaryConfigurationRepository salaryConfigurationRepository;
    private final OvertimeRecordRepository overtimeRecordRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<AttendanceDTO> getAttendancesByDate(LocalDate date) {
        validateDate(date);
        return attendanceRepository.findByDate(date);
    }

    @Override
    public AttendanceDTO getAttendanceById(Long id) {
        Attendance attendance = findAttendanceById(id);
        return modelMapper.map(attendance, AttendanceDTO.class);
    }

    @Override
    public AttendanceDTO createAttendance(AttendanceDTO attendanceDTO) {
        Attendance attendance = modelMapper.map(attendanceDTO, Attendance.class);
        Attendance saved = attendanceRepository.save(attendance);

        processOvertimeIfNeeded(attendanceDTO.getUserId(), attendance.getDate(),
                attendance.getCheckOut());

        return modelMapper.map(saved, AttendanceDTO.class);
    }

    @Transactional
    @Override
    public AttendanceDTO updateAttendance(Long id, AttendanceDTO attendanceDTO) {
        Attendance attendance = findAttendanceById(id);

        // Cập nhật thông tin chấm công
        updateAttendanceFields(attendance, attendanceDTO);
        Attendance saved = attendanceRepository.save(attendance);

        // Xử lý OT nếu có checkOut sau giờ tiêu chuẩn
        if (isOvertimeCheckout(attendanceDTO.getCheckOut())) {
            updateOrCreateOvertimeRecord(attendance.getUser().getUserId(),
                    attendance.getDate(), STANDARD_END_TIME, attendanceDTO.getCheckOut());
        }

        return modelMapper.map(saved, AttendanceDTO.class);
    }

    @Override
    public boolean deleteAttendance(Long id) {
        Attendance attendance = findAttendanceById(id);
        deleteRelatedOvertimeRecords(attendance);
        attendanceRepository.delete(attendance);
        return true;
    }

    @Override
    public List<AttendanceDTO> getAttendancesByUserAndDateRange(Long userId, LocalDate start, LocalDate end) {
        validateUserAndDateRange(userId, start, end);
        return attendanceRepository.findAttendancesByUserAndDateRange(userId, start, end);
    }

    @Override
    public String handleSocketAttendance(Long userId, LocalDateTime time) {
        validateSocketAttendanceParams(userId, time);

        LocalDate date = time.toLocalDate();
        LocalTime eventTime = time.toLocalTime();
        User user = findUserById(userId);

        List<Attendance> todayRecords = attendanceRepository.findAttendancesByUserAndDate(userId, date);

        if (todayRecords.isEmpty()) {
            return createNewCheckIn(user, date, eventTime);
        } else {
//            Attendance lastRecord = todayRecords.get(todayRecords.size() - 1);
//
//            if (lastRecord.getCheckOut() == null) {
//                return recordCheckOut(lastRecord, eventTime, userId, date);
//            } else {
//                return createNewCheckIn(user, date, eventTime);
//            }

            Attendance lastUnfinished = null;
            for (Attendance record : todayRecords) {
                if (record.getCheckOut() == null) {
                    return recordCheckOut(record, eventTime, userId, date);
                }
            }

            if (lastUnfinished.getCheckOut() == null) {
                return recordCheckOut(lastUnfinished, eventTime, userId, date);
            } else {
                return createNewCheckIn(user, date, eventTime);
            }
        }
    }

    @Override
    public String processOvertime(Long userId, LocalDate date, LocalTime overtimeStart, LocalTime overtimeEnd) {
        validateOvertimeParams(userId, overtimeStart, overtimeEnd);

        User user = findUserById(userId);
        SalaryConfiguration salaryConfig = findSalaryConfigForUser(userId);

        double overtimeHours = calculateOvertimeHours(overtimeStart, overtimeEnd);
        double overtimePay = calculateOvertimePay(overtimeHours, salaryConfig);

        saveOvertimeRecord(user, date, overtimeStart, overtimeEnd, overtimeHours, overtimePay);

        return "đã ghi nhận làm thêm giờ thành công (" + String.format("%.2f", overtimeHours) + " giờ).";
    }

    // Utility methods
    private void validateDate(LocalDate date) {
        if (date == null) {
            throw new BadRequestException("Ngày không được để trống.");
        }
    }

    private void validateUserAndDateRange(Long userId, LocalDate start, LocalDate end) {
        if (userId == null || start == null || end == null) {
            throw new BadRequestException("Thiếu thông tin truy vấn (ID nhân viên, ngày bắt đầu, ngày kết thúc).");
        }
    }

    private void validateSocketAttendanceParams(Long userId, LocalDateTime time) {
        if (userId == null || time == null) {
            throw new BadRequestException("Thiếu thông tin chấm công.");
        }
    }

    private void validateOvertimeParams(Long userId, LocalTime overtimeStart, LocalTime overtimeEnd) {
        if (userId == null || overtimeStart == null || overtimeEnd == null) {
            throw new BadRequestException("Thiếu thông tin làm thêm giờ.");
        }

        if (overtimeEnd.isBefore(overtimeStart)) {
            throw new BadRequestException("Thời gian kết thúc làm thêm không được trước thời gian bắt đầu.");
        }
    }

    private Attendance findAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dữ liệu chấm công với ID: " + id));
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + userId));
    }

    private SalaryConfiguration findSalaryConfigForUser(Long userId) {
        return salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy cấu hình lương của nhân viên với ID: " + userId));
    }

    private void processOvertimeIfNeeded(Long userId, LocalDate date, LocalTime checkOut) {
        // Nếu có giờ checkOut và sau thời gian tiêu chuẩn thì xử lý OT
        if (isOvertimeCheckout(checkOut)) {
            processOvertime(userId, date, STANDARD_END_TIME, checkOut);
        }
    }

    private boolean isOvertimeCheckout(LocalTime checkOut) {
        return checkOut != null && checkOut.isAfter(STANDARD_END_TIME);
    }

    private void updateAttendanceFields(Attendance attendance, AttendanceDTO attendanceDTO) {
        attendance.setCheckIn(attendanceDTO.getCheckIn());
        attendance.setCheckOut(attendanceDTO.getCheckOut());
        attendance.setDate(attendanceDTO.getDate());
    }

    private void updateOrCreateOvertimeRecord(Long userId, LocalDate date,
                                              LocalTime overtimeStart, LocalTime overtimeEnd) {
        Optional<OvertimeRecord> existingOT = overtimeRecordRepository
                .findByUser_UserIdAndOvertimeDate(userId, date);

        SalaryConfiguration salaryConfig = findSalaryConfigForUser(userId);
        double overtimeHours = calculateOvertimeHours(overtimeStart, overtimeEnd);
        double overtimePay = calculateOvertimePay(overtimeHours, salaryConfig);

        if (existingOT.isPresent()) {
            updateExistingOvertimeRecord(existingOT.get(), overtimeStart, overtimeEnd, overtimeHours, overtimePay);
        } else {
            createNewOvertimeRecord(userId, date, overtimeStart, overtimeEnd, overtimeHours, overtimePay);
        }
    }

    private void updateExistingOvertimeRecord(OvertimeRecord record, LocalTime start, LocalTime end,
                                              double hours, double pay) {
        record.setOvertimeStart(start);
        record.setOvertimeEnd(end);
        record.setOvertimeHour(hours);
        record.setOvertimePay(pay);
        overtimeRecordRepository.save(record);
    }

    private void createNewOvertimeRecord(Long userId, LocalDate date, LocalTime start,
                                         LocalTime end, double hours, double pay) {
        User user = findUserById(userId);
        OvertimeRecord newOt = OvertimeRecord.builder()
                .user(user)
                .overtimeDate(date)
                .overtimeStart(start)
                .overtimeEnd(end)
                .overtimeHour(hours)
                .overtimePay(pay)
                .build();
        overtimeRecordRepository.save(newOt);
    }

    private void deleteRelatedOvertimeRecords(Attendance attendance) {
        overtimeRecordRepository.deleteByUser_UserIdAndOvertimeDate(
                attendance.getUser().getUserId(), attendance.getDate());
    }

    private String createNewCheckIn(User user, LocalDate date, LocalTime eventTime) {
        Attendance newAttendance = new Attendance();
        newAttendance.setUser(user);
        newAttendance.setDate(date);
        newAttendance.setCheckIn(eventTime);
        attendanceRepository.save(newAttendance);
        return "Đã ghi nhận check-in lúc " + eventTime;
    }

    private String recordCheckOut(Attendance record, LocalTime eventTime, Long userId, LocalDate date) {
        record.setCheckOut(eventTime);
        attendanceRepository.save(record);

        // Xử lý OT nếu cần
        if (isOvertimeCheckout(eventTime)) {
            processOvertime(userId, date, STANDARD_END_TIME, eventTime);
        }

        return "Đã ghi nhận check-out lúc " + eventTime;
    }

    private double calculateOvertimeHours(LocalTime overtimeStart, LocalTime overtimeEnd) {
        long overtimeMinutes = Duration.between(overtimeStart, overtimeEnd).toMinutes();
        return overtimeMinutes / 60.0;
    }

    private double calculateOvertimePay(double overtimeHours, SalaryConfiguration salaryConfig) {
        double hourSalary = salaryConfig.getBasicSalary() / WORKING_DAYS_PER_MONTH / WORKING_HOURS_PER_DAY;
        return overtimeHours * salaryConfig.getOvertimeRate() * hourSalary;
    }

    private void saveOvertimeRecord(User user, LocalDate date, LocalTime start, LocalTime end,
                                    double hours, double pay) {
        OvertimeRecord overtimeRecord = OvertimeRecord.builder()
                .user(user)
                .overtimeDate(date)
                .overtimeStart(start)
                .overtimeEnd(end)
                .overtimeHour(hours)
                .overtimePay(pay)
                .build();

        overtimeRecordRepository.save(overtimeRecord);
    }
}