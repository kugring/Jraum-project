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

import com.kugring.back.service.FileService;

@Service
public class FileServiceImplement implements FileService {

    @Value("${file.path}")
    private String filePath; // 상대 경로 (application.properties에서 가져옴)

    @Value("${file.url}")
    private String fileUrl; // 파일 URL

    // 현재 프로젝트 루트 경로
    private final Path rootPath = Paths.get(System.getProperty("user.dir"));


    @Override
    @SuppressWarnings("null")
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
            // 파일 저장
            file.transferTo(savePath.toFile());
        } catch (Exception exception) {

            System.out.println("fileservice catch");
            exception.printStackTrace();
            return null;
        }

        // 반환할 파일 URL
        return fileUrl + saveFileName;
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

}
