import os

def print_tree(directory, prefix=""):
    # Lấy danh sách file và thư mục
    entries = os.listdir(directory)
    entries.sort()  # Sắp xếp để in đẹp hơn

    for index, entry in enumerate(entries):
        path = os.path.join(directory, entry)
        is_last = index == len(entries) - 1
        connector = "└── " if is_last else "├── "

        print(prefix + connector + entry)

        if os.path.isdir(path):
            extension = "    " if is_last else "│   "
            print_tree(path, prefix + extension)

# Gọi hàm với đường dẫn cần in cấu trúc
folder_path = "./"
print_tree(folder_path)
