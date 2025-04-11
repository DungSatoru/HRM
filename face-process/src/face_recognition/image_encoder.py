# import face_recognition
# import os
# import time

# def encode_images(directory_path, encoding_file, ID):
#     if not os.path.exists(directory_path):
#         print(f"Lỗi: Thư mục '{directory_path}' không tồn tại!")
#         return

#     if not os.path.isfile(encoding_file):
#         with open(encoding_file, 'w') as file:
#             file.write('')

#     with open(encoding_file, 'a') as encoding_file:
#         for filename in os.listdir(directory_path):
#             image_path = os.path.join(directory_path, filename)

#             if not os.path.isfile(image_path):
#                 continue  # Bỏ qua nếu không phải file ảnh

#             try:
#                 image = face_recognition.load_image_file(image_path)
#                 encodings = face_recognition.face_encodings(image)

#                 if len(encodings) > 0:
#                     encoding_file.write(f"{ID}: {list(encodings[0])}\n")
#                     print(f"Mã hóa thành công {filename}")
#                 else:
#                     print(f"Không tìm thấy khuôn mặt trong {filename}, bỏ qua.")
#             except Exception as e:
#                 print(f"Lỗi xử lý {filename}: {e}")



import face_recognition
import sys
import os
import cv2
import time

def encode_images(video_path, directory_path, encoding_file, ID):
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
                    encoding_f.write(f"{ID}: {list(encodings[0])}\n")
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
        print("How use: python image_encoder.py <video_path> <folder_path> <encoding_file> <ID>")
        sys.exit(1)

    video_path = sys.argv[1]
    folder_path = sys.argv[2]
    encoding_file = sys.argv[3]
    ID = sys.argv[4]

    encode_images(video_path, folder_path, encoding_file, ID)
