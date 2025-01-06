package com.kugring.back.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;

import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);

    @Value("${tdomain}")
    private String tdomain;

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("https://" + tdomain) // 허용할 출처 설정
                .withSockJS()
                .setInterceptors(new HandshakeLoggingInterceptor()); // 핸드셰이크 로깅 인터셉터 추가
    }

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/order", "/pointCharge", "/user", "/manager", "/cashPay"); // 메세지 브로커 경로
        config.setApplicationDestinationPrefixes("/app"); // 앱 내 메세지 경로
    }

    /**
     * WebSocket 핸드셰이크 요청을 로깅하는 인터셉터
     */
    private static class HandshakeLoggingInterceptor implements HandshakeInterceptor {

        @Override
        public boolean beforeHandshake(@NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response, @NonNull WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
            logger.info("Handshake request received from IP: {}", request.getRemoteAddress());
            logger.info("Headers: {}", request.getHeaders());
            logger.info("URI: {}", request.getURI());
            return true; // 핸드셰이크 진행 허용
        }

        @Override
        public void afterHandshake(@NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response, @NonNull WebSocketHandler wsHandler, Exception exception) {
            if (exception != null) {
                logger.error("Handshake failed with exception: {}", exception.getMessage());
            } else {
                logger.info("Handshake completed successfully for URI: {}", request.getURI());
            }
        }
    }
}
