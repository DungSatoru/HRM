package tlu.finalproject.hrmanagement.utils;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

@Component
public class PythonRunner {

    @Value("${face.recognition.dir.root}")
    private String scriptDirectory;

    @Value("${face.recognition.file.main}")
    private String mainScriptPath;

    @Value("${app.run-python-on-start}")
    private boolean runPythonOnStart;

    @Value("${face.recognition.camera.ip}")
    private String cameraIp;

    @Value("${face.recognition.camera.user}")
    private String cameraUser;

    @Value("${face.recognition.camera.password}")
    private String cameraPassword;

    private Process process; // Giữ tiến trình Python


    @PostConstruct
    public void startPythonScript() {
        if (!runPythonOnStart) {
            System.out.println("Python script not started: app.run-python-on-start=false");
            return;
        }

        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "python",
                    new File(mainScriptPath).getName(),
                    "--ip", cameraIp,
                    "--user", cameraUser,
                    "--password", cameraPassword
            );
            processBuilder.directory(new File(scriptDirectory));
            processBuilder.redirectErrorStream(true);
            this.process = processBuilder.start();

            // Log output để debug
            new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.out.println("Python: " + line);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }).start();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @PreDestroy
    public void stopPythonScript() {
        if (process != null && process.isAlive()) {
            process.destroy();
            try {
                if (!process.waitFor(3, java.util.concurrent.TimeUnit.SECONDS)) {
                    System.out.println("Process not terminated in time, forcing...");
                    process.destroyForcibly();
                } else {
                    System.out.println("Python process terminated gracefully.");
                }
            } catch (InterruptedException e) {
                process.destroyForcibly();
            }
        }
    }

}
