package tlu.finalproject.hrmanagement.service.iplm;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.model.Attendance;
import tlu.finalproject.hrmanagement.model.User;
import tlu.finalproject.hrmanagement.repository.AttendanceRepository;
import tlu.finalproject.hrmanagement.repository.UserRepository;
import tlu.finalproject.hrmanagement.service.AttendanceService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceIplm implements AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String processAttendance(Long userId, LocalDateTime time) {
        LocalDate date = time.toLocalDate();
        LocalTime eventTime = time.toLocalTime();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
}
