package com.kugring.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
import com.kugring.back.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/order")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

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

    ResponseEntity<? super PostPointOrderResponseDto> resposne = orderService.postPointOrderList(userId, reqeustBody);
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
    ResponseEntity<? super GetOrderListResponseDto> response = orderService.getOrderList(userId, page, size, name, status, date);
    return response;
  }

  @PatchMapping("/approve")
  public ResponseEntity<? super PatchOrderApproveResponseDto> patchOrder(
      @AuthenticationPrincipal String userId,
      @RequestBody @Valid PatchOrderApproveRequestDto reqeustBody) {
    ResponseEntity<? super PatchOrderApproveResponseDto> response = orderService.patchOrderApprove(userId, reqeustBody);

    return response;
  }


  @PatchMapping("/refund")
public ResponseEntity<? super PatchOrderRefundResponseDto> patchOrderRefund(
    @AuthenticationPrincipal String userId,
    @RequestBody @Valid PatchOrderRefundRequestDto requestBody) {
  ResponseEntity<? super PatchOrderRefundResponseDto> response = orderService.patchOrderRefund(userId, requestBody);

  return response;
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