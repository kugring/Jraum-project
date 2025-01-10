package com.kugring.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import com.kugring.back.dto.request.order.PatchOrderApproveRequestDto;
import com.kugring.back.dto.request.order.PatchOrderRefundRequestDto;
import com.kugring.back.dto.request.order.PostOrderCashRequestDto;
import com.kugring.back.dto.request.order.PostPointOrderRequestDto;
import com.kugring.back.dto.response.order.GetCashNameResponseDto;
import com.kugring.back.dto.response.order.GetOrderListResponseDto;
import com.kugring.back.dto.response.order.GetOrderManagementResponseDto;
import com.kugring.back.dto.response.order.PatchOrderApproveResponseDto;
import com.kugring.back.dto.response.order.PatchOrderRefundResponseDto;
import com.kugring.back.dto.response.order.PostOrderCashResponseDto;
import com.kugring.back.dto.response.order.PostPointOrderResponseDto;
import com.kugring.back.service.FileService;
import com.kugring.back.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final FileService fileService;

    // @PostMapping("/filter")
    // public ResponseEntity<? super FilterOrderListResponseDto>
    // getOrderList(@RequestBody @Valid FilterOrderListRequestDto reqeustBody) {
    // ResponseEntity<? super FilterOrderListResponseDto> resposne =
    // orderService.filterOrderList(reqeustBody);
    // return resposne;
    // }

    @PostMapping("/payment/point")
    public ResponseEntity<? super PostPointOrderResponseDto> postOrder(
            @RequestBody @Valid PostPointOrderRequestDto reqeustBody,
            @AuthenticationPrincipal String userId) {

        ResponseEntity<? super PostPointOrderResponseDto> resposne = orderService.postPointOrderList(userId,
                reqeustBody);
        return resposne;
    }

    @PostMapping("/payment/cash")
    public ResponseEntity<? super PostOrderCashResponseDto> postOrder(
            @RequestBody @Valid PostOrderCashRequestDto reqeustBody) {
        ResponseEntity<? super PostOrderCashResponseDto> resposne = orderService.postCashOrderList(reqeustBody);
        return resposne;
    }

    @GetMapping("/cash/name")
    public ResponseEntity<? super GetCashNameResponseDto> getCashName() {
        ResponseEntity<? super GetCashNameResponseDto> resposne = orderService.getCashName();
        return resposne;
    }

    @GetMapping("/manager/order-management")
    public ResponseEntity<? super GetOrderManagementResponseDto> getOrderManagement(
            @AuthenticationPrincipal String userId) {
        ResponseEntity<? super GetOrderManagementResponseDto> resposne = orderService.getOrderManagement(userId);
        return resposne;
    }

    @GetMapping("/manager/order-list")
    public ResponseEntity<? super GetOrderListResponseDto> getOrderList(
            @AuthenticationPrincipal String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date) {
        ResponseEntity<? super GetOrderListResponseDto> response = orderService.getOrderList(userId, page, size, name,
                status, date);
        return response;
    }

    @PatchMapping("/approve")
    public ResponseEntity<? super PatchOrderApproveResponseDto> patchOrder(
            @AuthenticationPrincipal String userId,
            @RequestBody @Valid PatchOrderApproveRequestDto reqeustBody) {
        ResponseEntity<? super PatchOrderApproveResponseDto> response = orderService.patchOrderApprove(userId,
                reqeustBody);

        return response;
    }

    @PatchMapping("/refund")
    public ResponseEntity<? super PatchOrderRefundResponseDto> patchOrderRefund(
            @AuthenticationPrincipal String userId,
            @RequestBody @Valid PatchOrderRefundRequestDto requestBody) {
        ResponseEntity<? super PatchOrderRefundResponseDto> response = orderService.patchOrderRefund(userId,
                requestBody);

        return response;
    }

    // orderId를 받아 음성을 생성하여 반환
    // @GetMapping(value = "/{orderId}/audio", produces =
    // MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @GetMapping(value = "/{orderId}/audio", produces = "audio/wav") // WAV MIME 타입 지정
    public ResponseEntity<byte[]> getOrderAudio(@PathVariable("orderId") Long orderId) {
        System.out.println("Request received for orderId: " + orderId);
    
        // TTS를 통해 음성 생성
        byte[] audioData = fileService.generateSsmlOrderAudio(orderId);
        
        if (audioData == null || audioData.length == 0) {
            System.out.println("Error: Audio data is empty or null for orderId: " + orderId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Error 응답
        }
    
        System.out.println("Audio data generated successfully for orderId: " + orderId);
    
        // CORS 헤더 추가 및 MIME 타입 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Allow-Origin", "https://hyunam.site"); // 특정 도메인에서 접근 허용
        headers.add("Content-Type", "audio/wav"); // WAV 형식으로 MIME 타입 설정
        headers.add("Content-Disposition", "inline; filename=\"order-audio.wav\""); // 파일 이름 설정
    
        System.out.println("Headers set: " + headers);
    
        return ResponseEntity.ok()
                .headers(headers) // CORS와 Content-Type 헤더를 포함하여 응답
                .body(audioData); // 오디오 파일 본문
    }
    
    // @PutMapping("/{orderListId}")
    // public ResponseEntity<? super PutOrderListResponseDto>
    // putOrderList(@RequestBody @Valid PutOrderListRequestDto requestBody,
    // @PathVariable("orderListId") Integer orderListId) {
    // ResponseEntity<? super PutOrderListResponseDto> resposne =
    // orderService.putOrderList(orderListId, requestBody);
    // return resposne;
    // }
}