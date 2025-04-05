# websocket_client.py
import websocket
import json
from datetime import datetime

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
            print("Server Response:", response)

            ws.close()
        except Exception as e:
            print(f"Failed to send attendance to server: {e}")
