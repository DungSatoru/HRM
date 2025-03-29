package tlu.finalproject.hrmanagement.service;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalDateTime;

public interface AttendanceService {
    String processAttendance(Long userId, LocalDateTime time);
}
