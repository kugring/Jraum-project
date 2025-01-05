package com.kugring.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.lang.NonNull;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("https://api.hyunam.site", "https://hyunam.site", "*")
                .withSockJS();
        
        // /ws/info 경로 처리
        registry.addEndpoint("/ws/info")
                .setAllowedOrigins("https://api.hyunam.site", "https://hyunam.site", "*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/order", "/pointCharge", "/user", "/manager", "/cashPay");  
        config.setApplicationDestinationPrefixes("/app");
    }
}

