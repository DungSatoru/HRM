# encoding_loader.py
import mysql.connector
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


class EncodingHelper:
    @staticmethod
    def save_face_encoding(user_id, encoding_vector, db_config):
        try:
            blob = np.array(encoding_vector, dtype=np.float32).tobytes()

            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()

            cursor.execute(
                "INSERT INTO face_vectors (user_id, encoding) VALUES (%s, %s)",
                (user_id, blob)
            )

            conn.commit()
        except mysql.connector.Error as err:
            print(f"Lỗi khi lưu dữ liệu: {err}")
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def load_face_encodings(db_config):
        conn = None
        cursor = None
        ids = []
        encodings = []

        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()
            cursor.execute("SELECT user_id, encoding FROM face_vectors")
            result = cursor.fetchall()

            for user_id, blob in result:
                vector = np.frombuffer(blob, dtype=np.float32)
                ids.append(user_id)
                encodings.append(vector)
        except mysql.connector.Error as err:
            print(f"Lỗi khi tải dữ liệu: {err}")
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

        return ids, encodings


face_ids, encodings = EncodingLoader.load_encoding_file(r"data\encodings.txt")

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'hr_management',
    'port': 3306
}
def insert_face_vector(user_id, encoding_vector):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Chuyển list -> bytes
        blob = np.array(encoding_vector, dtype=np.float32).tobytes()

        # Chèn vào bảng
        cursor.execute(
            "INSERT INTO face_vectors (user_id, encoding) VALUES (%s, %s)",
            (user_id, blob)
        )

        conn.commit()
        print(f"Đã chèn vector của user {user_id}")
    except mysql.connector.Error as err:
        print(f"Lỗi khi lưu user {user_id}: {err}")
    finally:
        cursor.close()
        conn.close()
        
# for user_id, encoding_vector in zip(face_ids, encodings):
#     insert_face_vector(user_id, encoding_vector)
