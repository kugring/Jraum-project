package com.kugring.back.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    // 클라이언트가 "/app/sendMessage"로 메시지를 보내면 실행
    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages") // 메시지를 구독하는 경로
    public String sendMessage(String message) {
        System.out.println("Received message: " + message);
        return "Server Response: " + message;
    }
}
