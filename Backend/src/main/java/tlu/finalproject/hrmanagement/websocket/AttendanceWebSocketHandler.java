package tlu.finalproject.hrmanagement.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tlu.finalproject.hrmanagement.dto.AttendanceDTO;
import tlu.finalproject.hrmanagement.service.AttendanceService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
public class AttendanceWebSocketHandler extends TextWebSocketHandler {
    private final AttendanceService attendanceService;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload(); // Dữ liệu từ Python gửi lên
        ObjectMapper objectMapper = new ObjectMapper();

        // Chuyển đổi JSON thành object
        AttendanceDTO attendanceDTO = objectMapper.readValue(payload, AttendanceDTO.class);

        // Chuyển đổi time từ String sang LocalDateTime
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime attendanceTime = LocalDateTime.parse(attendanceDTO.getTime(), formatter);

        // Gọi service để lưu vào database
        attendanceService.processAttendance(attendanceDTO.getUserId(), attendanceTime);

        session.sendMessage(new TextMessage("Attendance received"));
    }
}


