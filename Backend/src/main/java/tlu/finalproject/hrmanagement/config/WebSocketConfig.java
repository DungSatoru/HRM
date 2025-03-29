package tlu.finalproject.hrmanagement.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import tlu.finalproject.hrmanagement.websocket.AttendanceWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final AttendanceWebSocketHandler attendanceWebSocketHandler;

    @Autowired
    public WebSocketConfig(AttendanceWebSocketHandler attendanceWebSocketHandler) {
        this.attendanceWebSocketHandler = attendanceWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(attendanceWebSocketHandler, "/ws/attendance")
                .setAllowedOrigins("*");
    }
}