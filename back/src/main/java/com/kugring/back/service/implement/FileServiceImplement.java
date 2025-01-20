package com.kugring.back.service.implement;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.texttospeech.v1.AudioConfig;
import com.google.cloud.texttospeech.v1.AudioEncoding;
import com.google.cloud.texttospeech.v1.SsmlVoiceGender;
import com.google.cloud.texttospeech.v1.SynthesisInput;
import com.google.cloud.texttospeech.v1.SynthesizeSpeechResponse;
import com.google.cloud.texttospeech.v1.TextToSpeechClient;
import com.google.cloud.texttospeech.v1.VoiceSelectionParams;
import com.google.protobuf.ByteString;
import com.kugring.back.entity.Order;
import com.kugring.back.entity.OrderDetail;
import com.kugring.back.repository.OrderRepository;
import com.kugring.back.service.FileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileServiceImplement implements FileService {

    private final OrderRepository orderRepository;

    @Value("${file.path}")
    private String filePath; // 상대 경로 (application.properties에서 가져옴)

    @Value("${file.url}")
    private String fileUrl; // 파일 URL

    // 현재 프로젝트 루트 경로
    private final Path rootPath = Paths.get(System.getProperty("user.dir"));

    @Override
    public String upload(MultipartFile file) {

        // 파일이 비어있으면 null 반환
        if (file.isEmpty()) {
            return null;
        }

        // 파일 저장을 위한 디렉토리 생성
        Path uploadDir = rootPath.resolve(filePath).normalize();
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

        // 고유한 파일 이름 생성
        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uuid = UUID.randomUUID().toString();
        String saveFileName = uuid + extension;

        Path savePath = uploadDir.resolve(saveFileName);
        try {
            file.transferTo(savePath.toFile()); // 파일 저장
        } catch (Exception exception) {
            exception.printStackTrace();
            return null;
        }
        return fileUrl + saveFileName; // 반환할 파일 URL
    }

    @Override
    public Resource getImage(String fileName) {

        try {
            // 파일 경로 생성
            Path uploadDir = rootPath.resolve(filePath).normalize();
            Path filePath = uploadDir.resolve(fileName).normalize();

            // 리소스 반환
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + fileName);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public byte[] generateTextAudio(String text) {
        try (TextToSpeechClient textToSpeechClient = TextToSpeechClient.create()) {
            // TTS 요청 생성
            SynthesisInput input = SynthesisInput.newBuilder().setText(text).build();

            VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
                    .setLanguageCode("ko-KR") // 한국어
                    .setName("ko-KR-Wavenet-D") // 스타일 음성
                    .setSsmlGender(SsmlVoiceGender.MALE) // 음성 성별
                    .build();

            AudioConfig audioConfig = AudioConfig.newBuilder()
                    .setAudioEncoding(AudioEncoding.MP3) // MP3 포맷
                    .build();

            // Google TTS 호출
            SynthesizeSpeechResponse response = textToSpeechClient.synthesizeSpeech(input, voice, audioConfig);
            ByteString audioContents = response.getAudioContent();

            return audioContents.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("TTS 처리 중 오류 발생", e);
        }
    }

    @Override
    public byte[] generateSsmlOrderAudio(Long orderId) {
        try (TextToSpeechClient textToSpeechClient = TextToSpeechClient.create()) {

            Order order = orderRepository.findByOrderId(orderId);
            String ssmlText = generateSsml(order);

            // SSML 입력을 생성
            SynthesisInput input = SynthesisInput.newBuilder()
                    .setSsml(ssmlText) // SSML 형식으로 설정
                    .build();

            VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
                    .setLanguageCode("ko-KR") // 한국어
                    .setName("ko-KR-Wavenet-D") // 스타일 음성
                    .setSsmlGender(SsmlVoiceGender.MALE) // 음성 성별
                    .build();

            AudioConfig audioConfig = AudioConfig.newBuilder()
                    // .setAudioEncoding(AudioEncoding.MP3) // MP3 포맷
                    .setAudioEncoding(AudioEncoding.LINEAR16) // WAV 형식으로 설정
                    .build();

            // Google TTS 호출
            SynthesizeSpeechResponse response = textToSpeechClient.synthesizeSpeech(input, voice, audioConfig);
            ByteString audioContents = response.getAudioContent();

            return audioContents.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("TTS 처리 중 오류 발생", e);
        }
    }

    // SSML 텍스트 생성
    public String generateSsml(Order order) {
        StringBuilder ssmlText = new StringBuilder();

        // SSML 기본 구조
        ssmlText.append("<speak>");

        // 주문자 이름 강조
        ssmlText.append("<emphasis level=\"strong\">")
                .append(order.getUser().getName());

        if (order.getUser().getDivision().equals("단체")) {
            ssmlText.append(",</emphasis>");
        } else {
            ssmlText.append("님,</emphasis>");
        }

        ssmlText.append("<break time=\"500ms\"/>");

        // 주문 항목 반복
        for (OrderDetail orderDetail : order.getOrderDetails()) {
            String menuName = orderDetail.getMenu().getName(); // 메뉴 이름
            int quantity = orderDetail.getQuantity(); // 수량

            // 각 메뉴와 수량에 대한 SSML 태그 생성
            ssmlText.append("<emphasis level=\"strong\">")
                    .append(menuName)
                    .append(" ")
                    .append(quantity)
                    .append("잔,</emphasis>");
        }

        // SSML 끝 태그
        ssmlText.append("<prosody level=\"strong\" pitch=\"+10%\">나왔습니닿아~</prosody>");
        ssmlText.append("</speak>");

        return ssmlText.toString();
    }

}
