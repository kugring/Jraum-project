package com.kugring.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.kugring.back.handler.MyWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer  {

    // @Override
    // public void configureMessageBroker(MessageBrokerRegistry config) {
    //     config.enableSimpleBroker("/topic", "/order", "/pointCharge", "/user", "/manager", "/cashPay");  // /topic 경로 추가
    //     config.setApplicationDestinationPrefixes("/app");
    // }

    // @SuppressWarnings("null")
    // @Override
    // public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    //     registry.addHandler(myHandler(), "/ws").setAllowedOrigins("*");
    // }


    @Override
    public void registerStompEndpoints(@SuppressWarnings("null") StompEndpointRegistry registry) {
    registry.addEndpoint("/ws").setAllowedOrigins("*");
    }


    public WebSocketHandler myHandler() {
        return new MyWebSocketHandler();
    }


}
