package com.kugring.back.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.kugring.back.service.FileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    // 이미지 업로드
    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) {
        return fileService.upload(file);
    }

    // 이미지 다운로드
    @GetMapping(value = "{fileName}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public Resource getImage(@PathVariable("fileName") String fileName) {
        return fileService.getImage(fileName);
    }

    // TTS로 오디오 생성 및 반환
    @GetMapping(value = "/tts", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getAudio(@RequestParam("text") String text) {
        byte[] audioData = fileService.generateTextAudio(text);
        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=\"tts-audio.mp3\"")
                .body(audioData);
    }
}
