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
import tlu.finalproject.hrmanagement.utils.AudioPlayer;

import java.time.*;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    // Repositories
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
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dữ liệu chấm công với ID: " + id));
        return modelMapper.map(attendance, AttendanceDTO.class);
    }

    @Override
    public AttendanceDTO createAttendance(AttendanceDTO attendanceDTO) {
        // 1. Lưu thông tin chấm công
        Attendance attendance = modelMapper.map(attendanceDTO, Attendance.class);
        Attendance saved = attendanceRepository.save(attendance);

        // 2. Lấy cấu hình lương
        SalaryConfiguration config = salaryConfigurationRepository.findByUser_UserId(attendance.getUser().getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy cấu hình lương cho nhân viên ID: " + attendance.getUser().getUserId()));

        // 3. Xử lý OT nếu có checkout muộn
        if (attendance.getCheckOut() != null && attendance.getCheckOut().isAfter(config.getWorkEndTime())) {
            handleOvertime(attendance, config);
        }

        return modelMapper.map(saved, AttendanceDTO.class);
    }

    @Transactional
    @Override
    public AttendanceDTO updateAttendance(Long id, AttendanceDTO attendanceDTO) {

        // 1. Lấy thông tin attendance hiện tại
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dữ liệu chấm công với ID: " + id));

        // 2. Lưu lại giờ checkOut cũ để kiểm tra thay đổi
        LocalTime oldCheckOut = attendance.getCheckOut();

        // 3. Cập nhật thông tin mới
        attendance.setCheckIn(attendanceDTO.getCheckIn());
        attendance.setCheckOut(attendanceDTO.getCheckOut());
        attendance.setDate(attendanceDTO.getDate());
        Attendance saved = attendanceRepository.save(attendance);

        // 4. Lấy cấu hình lương
        SalaryConfiguration config = salaryConfigurationRepository.findByUser_UserId(attendance.getUser().getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy cấu hình lương cho nhân viên ID: " + attendance.getUser().getUserId()));

        // 5. Xử lý OT trong các trường hợp:
        // - CheckOut mới muộn hơn giờ làm chuẩn
        // - CheckOut cũ không OT nhưng checkOut mới có OT
        // - CheckOut thay đổi nhưng vẫn trong khoảng OT
        if (attendance.getCheckOut() != null) {
            handleOvertimeUpdate(attendance, config, oldCheckOut);
        }

        return modelMapper.map(saved, AttendanceDTO.class);
    }

    @Override
    public boolean deleteAttendance(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dữ liệu chấm công với ID: " + id));
        overtimeRecordRepository.deleteByAttendance(attendance);
        attendanceRepository.delete(attendance);
        return true;
    }

    @Override
    public List<AttendanceDTO> getAttendancesByUserAndDateRange(Long userId, LocalDate start, LocalDate end) {
        if (userId == null || start == null || end == null) {
            throw new BadRequestException("Thiếu thông tin truy vấn (ID nhân viên, ngày bắt đầu, ngày kết thúc).");
        }
        return attendanceRepository.findAttendancesByUserAndDateRange(userId, start, end);
    }

    @Override
    public String handleSocketAttendance(Long userId, LocalDateTime time) {
        if (userId == null || time == null) {
            throw new BadRequestException("Thiếu thông tin chấm công.");
        }
        LocalDate date = time.toLocalDate();
        LocalTime eventTime = time.toLocalTime();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + userId));

        Attendance todayRecords = attendanceRepository.findAttendancesByUserAndDateAndCheckoutIsNull(userId, date);

        if (todayRecords != null && todayRecords.getCheckOut() == null) {
            return recordCheckOut(todayRecords, eventTime);
        } else {
            return createNewCheckIn(user, date, eventTime);
        }
    }

    private void handleOvertime(Attendance attendance, SalaryConfiguration config) {
        LocalTime standardEndTime = config.getWorkEndTime();
        LocalTime nightStart = LocalTime.of(22, 0);
        LocalTime checkOut = attendance.getCheckOut();

        // Tính toán giờ OT
        double dayHours = calculateHoursBetween(
                standardEndTime,
                checkOut.isAfter(nightStart) ? nightStart : checkOut
        );

        double nightHours = checkOut.isAfter(nightStart)
                ? calculateHoursBetween(nightStart, checkOut)
                : 0.0;

        // Tạo và lưu bản ghi OT
        OvertimeRecord overtimeRecord = OvertimeRecord.builder()
                .attendance(attendance)
                .startTime(standardEndTime)
                .endTime(checkOut)
                .dayHours(dayHours)
                .nightHours(nightHours)
                .build();

        overtimeRecordRepository.save(overtimeRecord);
    }

    private double calculateHoursBetween(LocalTime start, LocalTime end) {
        return Duration.between(start, end).toMinutes() / 60.0;
    }


    private void handleOvertimeUpdate(Attendance attendance, SalaryConfiguration config, LocalTime oldCheckOut) {
        LocalTime newCheckOut = attendance.getCheckOut();
        LocalTime standardEndTime = config.getWorkEndTime();

        // Trường hợp checkOut mới có OT
        if (newCheckOut.isAfter(standardEndTime)) {
            Optional<OvertimeRecord> existingOT = overtimeRecordRepository.findByAttendance(attendance);

            if (existingOT.isPresent()) {
                // Cập nhật bản ghi OT đã tồn tại
                updateExistingOvertime(existingOT.get(), newCheckOut, standardEndTime);
            } else {
                // Tạo mới bản ghi OT
                createNewOvertime(attendance, newCheckOut, standardEndTime);
            }
        }
        // Trường hợp checkOut cũ có OT nhưng mới không còn OT
        else if (oldCheckOut != null && oldCheckOut.isAfter(standardEndTime)) {
            overtimeRecordRepository.deleteByAttendance(attendance);
        }
    }

    private void updateExistingOvertime(OvertimeRecord ot, LocalTime newCheckOut, LocalTime standardEndTime) {
        LocalTime nightStart = LocalTime.of(22, 0);

        ot.setEndTime(newCheckOut);
        ot.setDayHours(calculateHoursBetween(
                standardEndTime,
                newCheckOut.isAfter(nightStart) ? nightStart : newCheckOut
        ));
        ot.setNightHours(newCheckOut.isAfter(nightStart)
                ? calculateHoursBetween(nightStart, newCheckOut)
                : 0.0);

        overtimeRecordRepository.save(ot);
    }

    private void createNewOvertime(Attendance attendance, LocalTime checkOut, LocalTime standardEndTime) {
        LocalTime nightStart = LocalTime.of(22, 0);

        OvertimeRecord ot = OvertimeRecord.builder()
                .attendance(attendance)
                .startTime(standardEndTime)
                .endTime(checkOut)
                .dayHours(calculateHoursBetween(
                        standardEndTime,
                        checkOut.isAfter(nightStart) ? nightStart : checkOut
                ))
                .nightHours(checkOut.isAfter(nightStart)
                        ? calculateHoursBetween(nightStart, checkOut)
                        : 0.0)
                .build();

        overtimeRecordRepository.save(ot);
    }


    private String createNewCheckIn(User user, LocalDate date, LocalTime eventTime) {
        Attendance newAttendance = new Attendance();
        newAttendance.setUser(user);
        newAttendance.setDate(date);
        newAttendance.setCheckIn(eventTime);
        attendanceRepository.save(newAttendance);
//        return "Đã ghi nhận check-in lúc " + eventTime;
        return "success";
    }

    private String recordCheckOut(Attendance record, LocalTime eventTime) {
        record.setCheckOut(eventTime);
        attendanceRepository.save(record);

        // 2. Lấy cấu hình lương
        SalaryConfiguration config = salaryConfigurationRepository.findByUser_UserId(record.getUser().getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy cấu hình lương cho nhân viên ID: " + record.getUser().getUserId()));

        // 3. Xử lý OT nếu có checkout muộn
        if (record.getCheckOut() != null && record.getCheckOut().isAfter(config.getWorkEndTime())) {
            handleOvertime(record, config);
        }
//        AudioPlayer.playSound("audio/success.wav");
        return "success";
    }
}