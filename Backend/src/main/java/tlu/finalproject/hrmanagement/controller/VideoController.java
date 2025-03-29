package tlu.finalproject.hrmanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tlu.finalproject.hrmanagement.service.VideoService;

import java.util.Map;

@RestController
@RequestMapping("/api/video")
public class VideoController {
    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file, @RequestParam("userId") String userId) {

        try {
            String filePath = videoService.saveVideo(file);
            String trainingResult = videoService.trainFaceEmployee(filePath, userId);
            return ResponseEntity.ok("Processing completed: " + trainingResult);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Upload failed!", "details", e.getMessage()));
        }
    }
}
