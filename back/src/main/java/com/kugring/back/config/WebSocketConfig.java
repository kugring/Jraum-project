package com.kugring.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.kugring.back.handler.MyWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer  {

    // @Override
    // public void configureMessageBroker(MessageBrokerRegistry config) {
    //     config.enableSimpleBroker("/topic", "/order", "/pointCharge", "/user", "/manager", "/cashPay");  // /topic 경로 추가
    //     config.setApplicationDestinationPrefixes("/app");
    // }

    @SuppressWarnings("null")
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(myHandler(), "/ws").setAllowedOrigins("*");
    }

    public WebSocketHandler myHandler() {
        return new MyWebSocketHandler();
    }


}
