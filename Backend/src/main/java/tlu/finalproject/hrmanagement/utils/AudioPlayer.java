package tlu.finalproject.hrmanagement.utils;

import javax.sound.sampled.*;

public class AudioPlayer {

    public static void playSound(String resourcePath) {
        new Thread(() -> {
            try {
                AudioInputStream audioStream = AudioSystem.getAudioInputStream(
                        AudioPlayer.class.getResource("/" + resourcePath));
                Clip clip = AudioSystem.getClip();
                clip.open(audioStream);

                FloatControl gainControl = (FloatControl) clip.getControl(FloatControl.Type.MASTER_GAIN);
                gainControl.setValue(6.0f);

                clip.start();
                while (clip.isRunning()) {
                    Thread.sleep(2000 + clip.getMicrosecondLength() / 1000);
                }
                clip.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}
