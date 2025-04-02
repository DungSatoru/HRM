# attendance_module.py - Attendance tracking functionality
import os
import csv
import time
import json
import websocket
from datetime import datetime

class AttendanceTracker:
    def __init__(self, checkin_folder, cooldown_time=600):
        """
        Initialize the attendance tracker
        
        Args:
            checkin_folder (str): Path to the folder for storing check-in records
            cooldown_time (int): Minimum time in seconds between check-ins for the same person
        """
        self.checkin_folder = checkin_folder
        self.cooldown_time = cooldown_time
    
    def _load_check_in_data(self, name):
        """
        Load check-in data for a specific person
        
        Args:
            name (str): Name of the person
            
        Returns:
            tuple: (dict of check-in data, path to check-in file)
        """
        check_in_data = {}
        check_in_file = os.path.join(self.checkin_folder, f"{name}_check_in.csv")

        if os.path.exists(check_in_file):
            with open(check_in_file, mode='r') as file:
                reader = csv.reader(file)
                # Try to skip header, handle the case if file is empty
                try:
                    next(reader)
                except StopIteration:
                    pass
                
                for row in reader:
                    if len(row) >= 2:  # Ensure row has enough elements
                        name, check_in_time = row
                        check_in_data[name] = check_in_time

        return check_in_data, check_in_file
    
    def _should_record_attendance(self, name):
        """
        Check if attendance should be recorded for this person based on cooldown period
        
        Args:
            name (str): Person's name
            
        Returns:
            tuple: (bool indicating if attendance should be recorded, check-in file path)
        """
        current_time = time.time()
        check_in_data, check_in_file = self._load_check_in_data(name)
        
        # Check if person already checked in within cooldown period
        if name in check_in_data:
            try:
                last_check_in_time = check_in_data[name]
                last_check_in_time = time.strptime(last_check_in_time, "%Y-%m-%d %H:%M:%S")
                last_check_in_time = time.mktime(last_check_in_time)
                
                if current_time - last_check_in_time < self.cooldown_time:
                    print(f"{name} has already checked in within the last {self.cooldown_time/60} minutes.")
                    return False, check_in_file
            except (ValueError, TypeError):
                # If there's an error parsing the time, allow check-in
                pass
                
        return True, check_in_file
    
    def record_attendance(self, name):
        """
        Record attendance for a recognized person
        
        Args:
            name (str): Name of the recognized person
            
        Returns:
            bool: True if attendance was recorded, False otherwise
        """
        if name == "Unknown":
            return False
            
        should_record, check_in_file = self._should_record_attendance(name)
        
        if should_record:
            check_in_time = time.strftime("%Y-%m-%d %H:%M:%S")
            
            # Create file with header if it doesn't exist
            if not os.path.exists(check_in_file):
                with open(check_in_file, mode='w', newline='') as file:
                    writer = csv.writer(file)
                    writer.writerow(["Name", "CheckInTime"])
            
            # Append attendance record
            with open(check_in_file, mode='a', newline='') as file:
                writer = csv.writer(file)
                writer.writerow([name, check_in_time])
            
            # Send attendance to server
            self._send_attendance_to_server(name)
            
            print(f"{name} checked in at {check_in_time}.")
            return True
            
        return False
    
    def _send_attendance_to_server(self, user_id):
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