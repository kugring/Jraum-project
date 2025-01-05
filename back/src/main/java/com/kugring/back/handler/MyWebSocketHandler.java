package com.kugring.back.handler;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import java.io.IOException;


@SuppressWarnings("null")
public class MyWebSocketHandler implements WebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("WebSocket 연결 성공: " + session.getId());
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws IOException {
        // 클라이언트에서 메시지 처리
        System.out.println("받은 메시지: " + message.getPayload());
        session.sendMessage(new TextMessage("응답 메시지"));
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        System.out.println("에러 발생: " + exception.getMessage());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus closeStatus) {
        System.out.println("WebSocket 연결 종료: " + session.getId());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
