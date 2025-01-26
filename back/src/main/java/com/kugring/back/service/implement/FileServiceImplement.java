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

            // 음정(Pitch)과 볼륨 조정
            AudioConfig audioConfig = AudioConfig.newBuilder()
                    .setAudioEncoding(AudioEncoding.MP3)
                    .setPitch(1.5) // 음정 조정
                    .setVolumeGainDb(16.0) // 음량을 10dB 키움 (최대 16까지 가능)
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

    // SSML을 기반으로 TTS 오디오를 생성하고, 효과음과 합치는 로직
    public byte[] generateSsmlOrderAudio(Long orderId) {
        try (TextToSpeechClient textToSpeechClient = TextToSpeechClient.create()) {
            // 주문 정보 가져오기
            Order order = orderRepository.findByOrderId(orderId);
            String ssmlText = generateSsml(order);

            // SSML 입력 생성
            SynthesisInput input = SynthesisInput.newBuilder()
                    .setSsml(ssmlText)
                    .build();

            VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
                    .setLanguageCode("ko-KR")
                    .setName("ko-KR-Neural2-A")
                    .setSsmlGender(SsmlVoiceGender.FEMALE)
                    .build();

            // 음정(Pitch)을 2로 설정
            AudioConfig audioConfig = AudioConfig.newBuilder()
                    .setAudioEncoding(AudioEncoding.MP3)
                    .setPitch(1.5) // 음정을 2로 설정
                    .build();
            // Google TTS 호출
            SynthesizeSpeechResponse response = textToSpeechClient.synthesizeSpeech(input, voice, audioConfig);
            byte[] ttsAudio = response.getAudioContent().toByteArray();
            return ttsAudio;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("TTS 처리 중 오류 발생", e);
        }
    }

    // SSML 텍스트 생성
    public String generateSsml(Order order) {
        StringBuilder ssmlText = new StringBuilder();

        // 출력되는 주문자의 이름, 닉네임을 결정
        String primaryName = (order.getUser().getNickname() != null && !order.getUser().getNickname().isEmpty())
                ? order.getUser().getNickname()
                : order.getUser().getName();

        // SSML 시작 태그
        ssmlText.append("<speak>");

        // 전체 SSML을 큰 소리로 감싸기
        ssmlText.append("<prosody volume=\"x-loud\">");
        ssmlText.append("<emphasis level=\"strong\">"); // 전체 강조 추가

        // 주문자 이름 추가
        ssmlText.append(primaryName);
        // 공백추가로 발음 정확도 올림 (잘못된 예시: '임재혁썽도님')
        ssmlText.append(" ");

        // 단체 주문인 경우 "님" 생략
        if ("단체".equals(order.getUser().getPosition())) {
            ssmlText.append(",");
        } else if (order.getUser().getPosition() != null) {
            ssmlText.append(order.getUser().getPosition());
            ssmlText.append("님,");
        } else {
            ssmlText.append("님,");
        }

        ssmlText.append(" 주문하신 ");

        // 주문 항목 반복
        for (OrderDetail orderDetail : order.getOrderDetails()) {
            String menuName = orderDetail.getMenu().getName(); // 메뉴 이름
            int quantity = orderDetail.getQuantity(); // 수량

            // 메뉴와 수량 추가
            ssmlText.append(menuName)
                    .append(" ")
                    .append(quantity)
                    .append("잔, ");
        }

        // SSML 끝 문구
        ssmlText.append("나왔습니다.");

        // SSML 강조 및 큰 소리 태그 닫기
        ssmlText.append("</emphasis>");
        ssmlText.append("</prosody>");

        // SSML 끝 태그
        ssmlText.append("</speak>");

        return ssmlText.toString();
    }

}
