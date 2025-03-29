package tlu.finalproject.hrmanagement.service;

import org.springframework.web.multipart.MultipartFile;

public interface VideoService {
    String saveVideo(MultipartFile file);
    String processVideo(String filePath);
    String trainFaceEmployee(String filePath, String Id);
}
