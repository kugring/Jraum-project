package com.kugring.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.lang.NonNull;



@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${tdomain}")
    private String tdomain;

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
        .setAllowedOrigins("https://hyunam.site", "https://www.hyunam.site")  // 두 도메인을 모두 명시적으로 설정
        .withSockJS();
    }

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/order", "/pointCharge", "/user", "/manager", "/cashPay");  // /topic 경로 추가
        config.setApplicationDestinationPrefixes("/app");
    }
    
}
