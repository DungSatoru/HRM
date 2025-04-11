# encoding_loader.py
import numpy as np

class EncodingLoader:
    @staticmethod
    def load_encoding_file(file_path):
        """
        Load face encodings from a text file
        
        Args:
            file_path (str): Path to the encoding file
            
        Returns:
            tuple: (list of names, list of encodings)
        """
        names = []
        encodings = []

        with open(file_path, 'r') as file:
            lines = file.readlines()

        current_name = None
        current_encoding = []

        for line in lines:
            parts = line.strip().split(': ')

            if len(parts) == 2:
                if current_name is not None:
                    names.append(current_name)
                    encodings.append(current_encoding)

                current_name = parts[0]
                # current_encoding = [float(value) for value in parts[1][1:-1].replace(']', '').split()]
                # Cập nhật phương thức chuyển đổi để xử lý số thực với ký hiệu khoa học
                current_encoding = [float(value.replace(',', '').strip()) for value in parts[1][1:-1].split()]
            elif current_name is not None:
                current_encoding.extend([float(value) for value in line.strip().replace(']', '').split()])

        if current_name is not None:
            names.append(current_name)
            encodings.append(current_encoding)

        return names, encodings
