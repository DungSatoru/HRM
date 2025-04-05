import face_recognition
import sys
import os
from PIL import Image, ImageDraw, ImageFont
import cv2
import  time

# 1️⃣ Load danh sách encoding từ file
def load_encoding_file(file_path):
    names = []
    encodings = []

    if not os.path.exists(file_path):
        print(f"Lỗi: File '{file_path}' không tồn tại!")
        return names, encodings

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
            current_encoding = [float(value) for value in parts[1][1:-1].replace(']', '').split()]
        elif current_name is not None:
            current_encoding.extend([float(value) for value in line.strip().replace(']', '').split()])

    if current_name is not None:
        names.append(current_name)
        encodings.append(current_encoding)

    return names, encodings

# 3️⃣ Mã hóa tất cả ảnh trong thư mục
def encode_images(video_path, directory_path, encoding_file, ID):
    extract_frames(video_path, folder_path)

    time.sleep(7)

    if not os.path.exists(directory_path):
        print(f"Lỗi: Thư mục '{directory_path}' không tồn tại!")
        return

    if not os.path.isfile(encoding_file):
        with open(encoding_file, 'w') as file:
            file.write('')

    with open(encoding_file, 'a') as encoding_file:
        for filename in os.listdir(directory_path):
            image_path = os.path.join(directory_path, filename)

            if not os.path.isfile(image_path):
                continue  # Bỏ qua nếu không phải file ảnh

            try:
                image = face_recognition.load_image_file(image_path)
                encodings = face_recognition.face_encodings(image)

                if len(encodings) > 0:
                    encoding_file.write(f"{ID}: {list(encodings[0])}\n")
                    # os.remove(image_path)
                    print(f"Mã hóa thành công {filename}")
                else:
                    print(f"Không tìm thấy khuôn mặt trong {filename}, bỏ qua.")
            except Exception as e:
                print(f"Lỗi xử lý {filename}: {e}")


def extract_frames(video_path, output_folder="D:\\Documents\\THUYLOIUNIVERSITY\\Semester8\\GraduationProject\\HRM\\Backend\\src\\main\\resources\\uploads\\ImageExtractFromVideo"):
    # Tạo thư mục lưu ảnh nếu chưa có
    os.makedirs(output_folder, exist_ok=True)

    # Đọc video
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    success, image = cap.read()

    while success:
        # Lưu mỗi frame với số thứ tự
        frame_name = os.path.join(output_folder, f"frame_{frame_count}.jpg")
        cv2.imwrite(frame_name, image)
        # print(f"Saved: {frame_name}")

        success, image = cap.read()
        frame_count += 1

    cap.release()
    print("Extracte all frames successfully!")

# 4️⃣ Chạy chương trình từ terminal
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python main.py command [options]")
        sys.exit(1)

    command = sys.argv[1]

    if command == "recognize_faces":
        if len(sys.argv) < 5:
            print("Usage: python main.py recognize_faces <image_path> <encoding_file> <output_file>")
            sys.exit(1)

        image_path = sys.argv[2]
        encodings_path = sys.argv[3]
        output_file = sys.argv[4]
        names, encodings = load_encoding_file(encodings_path)
        recognize_faces(image_path, names, encodings, output_file)

    elif command == "encode_images":
        if len(sys.argv) < 6:
            print("Usage: python main.py encode_images <folder_path> <encoding_file> <ID>")
            sys.exit(1)

        video_path = sys.argv[2]
        folder_path = sys.argv[3]
        encoding_file = sys.argv[4]
        ID = sys.argv[5]
        encode_images(video_path, folder_path, encoding_file, ID)

    else:
        print("Unknown command")
        sys.exit(1)


# python
# "D:\Documents\THUYLOIUNIVERSITY\Semester8\GraduationProject\HRM\frontend\test.py"
# encode_images
# Đường_Dẫn_Video
# "D:\Documents\THUYLOIUNIVERSITY\Semester8\GraduationProject\HRM\Backend\src\main\resources\uploads\ImageExtractFromVideo"
# "D:\Documents\THUYLOIUNIVERSITY\Semester8\GraduationProject\HRM\frontend\encodings.txt"
# "1"