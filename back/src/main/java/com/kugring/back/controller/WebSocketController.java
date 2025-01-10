package com.kugring.back.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.kugring.back.dto.object.OrderManagementListItem;
import com.kugring.back.dto.object.PointChargeRequestListItem;
import com.kugring.back.dto.request.webSocket.CashPayOkRequestDto;
import com.kugring.back.dto.request.webSocket.CashPayRequestDto;
import com.kugring.back.dto.request.webSocket.OrderTTSResquestDto;
import com.kugring.back.dto.request.webSocket.PointChargeRequestResponseDto;
import com.kugring.back.dto.response.webSocket.CashPayOkResponseDto;
import com.kugring.back.dto.response.webSocket.CashPayResponseDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Controller
public class WebSocketController {

    private int totalPrice = 0;
    private boolean waiting = false;

    // 클라이언트가 "/send/message"로 메시지를 보내면 실행
    @MessageMapping("/message")
    @SendTo("/receive/messages")
    public String sendMessage(String message) {
        return "Server Response: " + message;
    }

    @MessageMapping("/order")
    @SendTo("/receive/manager/order")
    public OrderManagementListItem handleOrder(OrderManagementListItem order) {
        return order;
    }

    @MessageMapping("/pointCharge/request")
    @SendTo("/receive/manager/pointCharge/request")
    public PointChargeRequestListItem handlePointChargeRequest(@Payload PointChargeRequestListItem pointChargeRequest) {
        return pointChargeRequest;
    }


    @MessageMapping("/cashPay/info")
    @SendTo("/receive/manager/cashPay/info")
    public CashPayResponseDto sendCashPayInfo(@Payload CashPayRequestDto request) {
        int totalPrice = request.getTotalPrice();
        boolean waiting = request.isWaiting();
        this.totalPrice = request.getTotalPrice();
        this.waiting = request.isWaiting();
        return new CashPayResponseDto(totalPrice, waiting);
    }
    

    @MessageMapping("/cashPayOk")
    @SendTo("/receive/user/cashPay")
    public CashPayOkResponseDto sendCashPayOk(@Payload CashPayOkRequestDto request) {
        boolean cashPayOk = request.isCashPayOk();
        return new CashPayOkResponseDto(cashPayOk);
    }

    @MessageMapping("/current/cashPay/info")
    @SendTo("/receive/manager/cashPay/info")
    public CashPayResponseDto sendCashPayInfo() {
        int totalPrice = this.totalPrice;
        boolean waiting = this.waiting;
        return new CashPayResponseDto(totalPrice, waiting);
    }


    @MessageMapping("/pointCharge/requestOk")
    @SendTo("/receive/user/pointCharge/requestOk")
    public PointChargeRequestResponseDto pointChargeRequestOk(PointChargeRequestResponseDto pointChargeRequest) {
        return pointChargeRequest;
    }
    
    @MessageMapping("/orderTTS")
    @SendTo("/receive/user/orderTTS")
    public Long orderTTS(@Payload OrderTTSResquestDto reqeust) {
        Long orderId = reqeust.getOrderId();
        System.out.println("orderId: "+ reqeust.getOrderId());
        return orderId; // 그대로 반환
    }
    
}
