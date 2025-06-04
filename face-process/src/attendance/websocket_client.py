# websocket_client.py
import websocket
import json
from datetime import datetime
import os
os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = '1'
import pygame
import time

class WebSocketClient:
    def send_attendance_to_server(self, user_id):
        """
        Send attendance data to the server via WebSocket
        
        Args:
            user_id (str): ID of the user who checked in
        """
        try:
            ws = websocket.create_connection("ws://localhost:8080/ws/attendance")

            data = {
                "userId": user_id,
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            ws.send(json.dumps(data))
            response = ws.recv()
            
            if response == "success":
                # Đường dẫn file âm thanh
                file_path = r"data\success.wav"

                # Khởi tạo pygame mixer
                pygame.mixer.init()
                pygame.mixer.music.load(file_path)
                pygame.mixer.music.play()

                # Chờ phát xong
                while pygame.mixer.music.get_busy():
                    time.sleep(0.1)

            ws.close()
        except Exception as e:
            print(f"Failed to send attendance to server: {e}")
