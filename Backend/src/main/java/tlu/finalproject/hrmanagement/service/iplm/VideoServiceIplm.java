package tlu.finalproject.hrmanagement.service.iplm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tlu.finalproject.hrmanagement.service.VideoService;

import java.io.*;
import java.util.concurrent.TimeUnit;


@Service
public class VideoServiceIplm implements VideoService {
    @Value("${face.recognition.script}")
    private String encoderFilePath;

    @Value("${face.recognition.frames}")
    private String extractFramesFilePath;

    @Value("${face.recognition.model}")
    private String encodingsPath;
    private static final String UPLOAD_DIR = "D:\\Documents\\THUYLOIUNIVERSITY\\Semester8\\GraduationProject\\HRM\\Backend\\src\\main\\resources\\uploads\\VideoFaceTraining";

    @Override
    public String saveVideo(MultipartFile file) {
        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = UPLOAD_DIR + File.separator + fileName;
            File videoFile = new File(filePath);
            file.transferTo(videoFile);

            return filePath;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save video file!", e);
        }
    }

    @Override
    public String processVideo(String filePath) {
        String extractFramesFilePath = "D:\\Documents\\THUYLOIUNIVERSITY\\Semester8\\GraduationProject\\HRM\\Backend\\src\\main\\python\\extract_frames.py";
        try {
            ProcessBuilder pb = new ProcessBuilder("python", extractFramesFilePath, filePath);
            Process process = pb.start();

            boolean finished = process.waitFor(10, TimeUnit.SECONDS); // Chờ tối đa 10 giây
            if (!finished) {
                System.err.println("Python script timeout!");
                process.destroy(); // Hủy tiến trình nếu quá lâu
            }


            return "Extract Successfully";
        } catch (Exception e) {
            throw new RuntimeException("Error processing video with Python script", e);
        }
    }

    @Override
    public String trainFaceEmployee(String filePath, String Id) {
//        String mainFilePath = "D:\\Documents\\THUYLOIUNIVERSITY\\Semester8\\GraduationProject\\HRM\\Backend\\src\\main\\python\\FaceRecognition.py";
//        String extractFramesFilePath = "D:\\Documents\\THUYLOIUNIVERSITY\\Semester8\\GraduationProject\\HRM\\Backend\\src\\main\\resources\\uploads\\ImageExtractFromVideo";
//        String encodingsPath = "D:\\Documents\\THUYLOIUNIVERSITY\\Semester8\\GraduationProject\\HRM\\Backend\\src\\main\\resources\\FaceEncoding\\encodings.txt";

        try {
            // Tạo command dưới dạng List<String> để tránh lỗi dấu cách
            ProcessBuilder pb = new ProcessBuilder(
                    "python",
                    encoderFilePath,
                    filePath,
                    extractFramesFilePath,
                    encodingsPath,
                    Id
            );

            pb.redirectErrorStream(true);


            // Tạo chuỗi command để trả về
            String commandString = String.join(" ", pb.command());

            // Chạy tiến trình
            Process process = pb.start();
            boolean finished = process.waitFor(180, TimeUnit.SECONDS);

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            String result = "";
            while ((line = reader.readLine()) != null) {
               result += (line + "/n");
            }

            if (!finished) {
                System.err.println("Python script timeout!");
                process.destroy();
                return "Timeout while processing face training. Command: " + result;
            }

            return "Train Successfully. Command: " + result;
        } catch (Exception e) {
            throw new RuntimeException("Error processing video with Python script. Command: " +
                    String.format("python %s %s %s %s %s",
                            encoderFilePath, filePath, extractFramesFilePath, encodingsPath, Id), e);
        }
    }


}