# checkin_data_handler.py
import os
import csv

class CheckInDataHandler:
    def __init__(self, checkin_folder):
        self.checkin_folder = checkin_folder

    def load_check_in_data(self, name):
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
                try:
                    next(reader)
                except StopIteration:
                    pass
                
                for row in reader:
                    if len(row) >= 2:
                        name, check_in_time = row
                        check_in_data[name] = check_in_time

        return check_in_data, check_in_file

    def create_check_in_file(self, check_in_file, name, check_in_time):
        """
        Create or append check-in data to file
        
        Args:
            check_in_file (str): Path to the check-in file
            name (str): Name of the person
            check_in_time (str): Time the person checked in
        """
        if not os.path.exists(check_in_file):
            with open(check_in_file, mode='w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow(["Name", "CheckInTime"])
        
        with open(check_in_file, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([name, check_in_time])
