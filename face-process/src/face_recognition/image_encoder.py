import face_recognition
import sys
import os
import cv2
import time
import numpy as np
import mysql.connector

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'hr_management',
    'port': 3306
}

def save_encoding_to_mysql(user_id, encoding_vector, db_config):
    try:
        blob = np.array(encoding_vector, dtype=np.float32).tobytes()
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO face_vectors (user_id, encoding) VALUES (%s, %s)",
            (user_id, blob)
        )

        conn.commit()
        cursor.close()
        conn.close()
        print(f"Saved encoding to MySQL for user_id: {user_id}")
    except Exception as e:
        print(f"Failed to save encoding for {user_id}: {e}")

def encode_images(video_path, directory_path, encoding_file, user_id):
    extract_frames(video_path, directory_path)

    if not os.path.exists(directory_path):
        print(f"Error: Folder '{directory_path}' is not exist!")
        return

    if not os.path.isfile(encoding_file):
        with open(encoding_file, 'w') as file:
            file.write('')

    with open(encoding_file, 'a') as encoding_f:
        for filename in os.listdir(directory_path):
            image_path = os.path.join(directory_path, filename)

            if not os.path.isfile(image_path):
                continue

            try:
                image = face_recognition.load_image_file(image_path)
                encodings = face_recognition.face_encodings(image)

                if len(encodings) > 0:
                    # encoding_f.write(f"{user_id}: {list(encodings[0])}\n")
                    save_encoding_to_mysql(user_id, encodings[0], db_config)

                    print(f"Encoded {filename} successfully")
                else:
                    print(f"Not found face in the {filename}, Skip!")
            except Exception as e:
                print(f"Error process {filename}: {e}")


def extract_frames(video_path, output_folder):
    os.makedirs(output_folder, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    success, image = cap.read()

    while success:
        frame_name = os.path.join(output_folder, f"frame_{frame_count}.jpg")
        cv2.imwrite(frame_name, image)
        success, image = cap.read()
        frame_count += 1

    cap.release()
    print("Extracted all frame successfully!")

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("How use: python image_encoder.py <video_path> <folder_path> <encoding_file> <user_id>")
        sys.exit(1)
        #  python "imageencodinh.py" "video" "exrtrach" "encodefile"

    video_path = sys.argv[1]
    folder_path = sys.argv[2]
    encoding_file = sys.argv[3]
    user_id = int(sys.argv[4])

    encode_images(video_path, folder_path, encoding_file, user_id)
