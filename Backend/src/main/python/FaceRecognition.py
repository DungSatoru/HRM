import face_recognition
import sys
import os
from PIL import Image, ImageDraw, ImageFont
import cv2
import time

# 1️⃣ Load encoding list from file
def load_encoding_file(file_path):
    names = []
    encodings = []

    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist!")
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

# 2️⃣ Face recognition in image
def recognize_faces(image_path, names, encodings, output_file):
    image = face_recognition.load_image_file(image_path)
    face_locations = face_recognition.face_locations(image)
    face_encodings = face_recognition.face_encodings(image, face_locations)

    results = []
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(encodings, face_encoding, tolerance=0.3)
        name = "Unknown"

        if True in matches:
            first_match_index = matches.index(True)
            name = names[first_match_index]

        results.append({"top": top, "right": right, "bottom": bottom, "left": left, "name": name})

    # Draw results on image
    pil_image = Image.fromarray(image)
    draw = ImageDraw.Draw(pil_image)
    font = ImageFont.load_default()

    for result in results:
        top, right, bottom, left = result["top"], result["right"], result["bottom"], result["left"]
        name = result["name"]

        if name == "Unknown":
            box_color = (255, 0, 0)  # Red
            text_color = (255, 255, 255, 255)  # White
        else:
            box_color = (0, 0, 255)  # Blue
            text_color = (255, 255, 255, 255)  # White

        draw.rectangle(((left, top), (right, bottom)), outline=box_color, width=2)
        text_width, text_height = draw.textbbox((0, 0), name, font=font)[2:]
        draw.rectangle(((left, bottom - text_height - 10), (right, bottom)), fill=box_color, outline=box_color)
        draw.text((left + 6, bottom - text_height - 5), name, fill=text_color, font=font)

    output_image_path = os.path.splitext(image_path)[0] + "_recognized.jpg"
    pil_image.save(output_image_path)
    print(f"Result image saved at: {output_image_path}")

    # Write results to file
    try:
        with open(output_file, "w") as file:
            if len(results) > 1:
                file.write("Multiple faces detected, please try again!")
            elif len(results) == 1:
                file.write(f"{results[0]['name']} ({results[0]['top']}, {results[0]['right']}, {results[0]['bottom']}, {results[0]['left']})")
            else:
                file.write("No faces detected.\n")
    except Exception as e:
        with open(output_file, "w") as file:
            file.write(f"Error executing the Python script: {e}\n")

# 3️⃣ Encode all images in directory
def encode_images(video_path, directory_path, encoding_file, ID):
    extract_frames(video_path, folder_path)

    time.sleep(7)

    if not os.path.exists(directory_path):
        print(f"Error: Directory '{directory_path}' does not exist!")
        return

    if not os.path.isfile(encoding_file):
        with open(encoding_file, 'w') as file:
            file.write('')

    with open(encoding_file, 'a') as encoding_file:
        for filename in os.listdir(directory_path):
            image_path = os.path.join(directory_path, filename)

            if not os.path.isfile(image_path):
                continue  # Skip if not an image file

            try:
                image = face_recognition.load_image_file(image_path)
                encodings = face_recognition.face_encodings(image)

                if len(encodings) > 0:
                    encoding_file.write(f"{ID}: {list(encodings[0])}\n")
                    # os.remove(image_path)
                    print(f"Encoded {filename} successfully!")
                else:
                    print(f"Face not found in {filename}, skipping!")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    # Delete all images in directory after encoding
    try:
        for filename in os.listdir(directory_path):
            image_path = os.path.join(directory_path, filename)
            if os.path.isfile(image_path):
                os.remove(image_path)
                print(f"Deleted image: {filename}")
    except Exception as e:
        print(f"Error deleting images: {e}")

def extract_frames(video_path, output_folder="D:\\Documents\\THUYLOIUNIVERSITY\\Semester8\\GraduationProject\\HRM\\Backend\\src\\main\\resources\\uploads\\ImageExtractFromVideo"):
    # Create folder if not exists
    os.makedirs(output_folder, exist_ok=True)

    # Read video
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    success, image = cap.read()

    while success:
        # Save each frame with index
        frame_name = os.path.join(output_folder, f"frame_{frame_count}.jpg")
        cv2.imwrite(frame_name, image)
        # print(f"Saved: {frame_name}")

        success, image = cap.read()
        frame_count += 1

    cap.release()
    print("Extracted all frames successfully!")

# 4️⃣ Run program from terminal
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
# "D:\\Documents\\THUYLOIUNIVERSITY\\Semester8\\GraduationProject\\HRM\\frontend\\test.py"
# encode_images
# Video_Path
# "D:\\Documents\\THUYLOIUNIVERSITY\\Semester8\\GraduationProject\\HRM\\Backend\\src\\main\\resources\\uploads\\ImageExtractFromVideo"
# "D:\\Documents\\THUYLOIUNIVERSITY\\Semester8\\GraduationProject\\HRM\\frontend\\encodings.txt"
# "1"
