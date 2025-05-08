package tlu.finalproject.hrmanagement.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tlu.finalproject.hrmanagement.service.FileStorageService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    @Value("${upload.path}")
    private String uploadDir;

    @Override
    public String saveFile(MultipartFile file) {
        try {
            // Tạo đường dẫn đến thư mục profiles
            Path profilesPath = Paths.get(uploadDir, "profiles");
            if (!Files.exists(profilesPath)) {
                Files.createDirectories(profilesPath);
                System.out.println("Đã tạo thư mục: " + profilesPath.toAbsolutePath());
            }

            String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
            Path targetLocation = profilesPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation);
            System.out.println("Đã lưu file tại: " + targetLocation.toAbsolutePath());

            // URL vẫn giữ nguyên
            return "/uploads/profiles/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu file: " + e.getMessage(), e);
        }
    }
}