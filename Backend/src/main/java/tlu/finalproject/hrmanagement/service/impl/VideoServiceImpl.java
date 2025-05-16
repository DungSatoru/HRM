package tlu.finalproject.hrmanagement.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tlu.finalproject.hrmanagement.service.VideoService;

import java.io.*;
import java.util.concurrent.TimeUnit;

@Service
public class VideoServiceImpl implements VideoService {

    @Value("${face.recognition.script}")
    private String encoderFilePath;

    @Value("${face.recognition.frames}")
    private String extractFramesFilePath;

    @Value("${face.recognition.model}")
    private String encodingsPath;

    @Value("${face.recognition.video}")
    private String uploadDirPath;

    @Override
    public String saveVideo(MultipartFile file) {
        try {
            File uploadDir = new File(uploadDirPath).getAbsoluteFile();
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File videoFile = new File(uploadDir, fileName);
            file.transferTo(videoFile);

            return videoFile.getAbsolutePath();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save video file!", e);
        }
    }

    @Override
    public String processVideo(String filePath) {
        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "python",
                    new File(extractFramesFilePath).getAbsolutePath(),
                    new File(filePath).getAbsolutePath()
            );

            pb.redirectErrorStream(true);
            Process process = pb.start();

            boolean finished = process.waitFor(30, TimeUnit.SECONDS);
            if (!finished) {
                process.destroy();
                return "Timeout while extracting frames.";
            }

            return "Extract Successfully";
        } catch (Exception e) {
            throw new RuntimeException("Error processing video with Python script", e);
        }
    }

    @Override
    public String trainFaceEmployee(String filePath, String userId) {
        clearDirectory(new File(extractFramesFilePath).getAbsoluteFile());
        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "python",
                    new File(encoderFilePath).getAbsolutePath(),
                    new File(filePath).getAbsolutePath(),
                    new File(extractFramesFilePath).getAbsolutePath(),
                    new File(encodingsPath).getAbsolutePath(),
                    userId
            );

            pb.redirectErrorStream(true);
            Process process = pb.start();

            boolean finished = process.waitFor(180, TimeUnit.SECONDS);
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            StringBuilder result = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line).append("\n");
            }

            if (!finished) {
                process.destroy();
                return "Timeout while processing face training. Output:\n" + result;
            }



            return "Train Successfully. Output:\n" + result;
        } catch (Exception e) {
            throw new RuntimeException("Error processing video with Python script.\nCommand: " +
                    String.format("python %s %s %s %s %s",
                            encoderFilePath, filePath, extractFramesFilePath, encodingsPath, userId), e);
        }
    }

    private void clearDirectory(File directory) {
        if (directory.exists() && directory.isDirectory()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (!file.delete()) {
                        System.err.println("Failed to delete file: " + file.getAbsolutePath());
                    }
                }
            }
        }
    }

}
