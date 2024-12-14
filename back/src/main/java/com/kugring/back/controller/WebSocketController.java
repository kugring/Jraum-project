package com.kugring.back.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.kugring.back.dto.object.OrderPageListItem;

@Controller
public class WebSocketController {

    // 클라이언트가 "/app/sendMessage"로 메시지를 보내면 실행
    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public String sendMessage(String message) {
        System.out.println("Received message: " + message);
        return "Server Response: " + message;
    }
    
    @MessageMapping("/sendOrder")
    @SendTo("/topic/order")
    public OrderPageListItem handleOrder(OrderPageListItem order) {
        System.out.println("Received order: " + order.getPosition());
        System.out.println("Received order: " + order.getName());
        return order;
    }
    

}
