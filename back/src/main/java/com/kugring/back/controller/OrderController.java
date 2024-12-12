package com.kugring.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kugring.back.dto.request.order.PostOrderCashRequestDto;
import com.kugring.back.dto.request.order.PostPointOrderRequestDto;
import com.kugring.back.dto.response.order.GetCashNameResponseDto;
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

  // @PatchMapping("/{orderListId}")
  // public ResponseEntity<? super PatchOrderListResponseDto>
  // patchOrder(@RequestBody @Valid PatchOrderListRequestDto requestBody,
  // @PathVariable("orderListId") Integer orderListId) {
  // ResponseEntity<? super PatchOrderListResponseDto> resposne =
  // orderService.patchOrderList(orderListId, requestBody);
  // return resposne;
  // }

  // @PutMapping("/{orderListId}")
  // public ResponseEntity<? super PutOrderListResponseDto>
  // putOrderList(@RequestBody @Valid PutOrderListRequestDto requestBody,
  // @PathVariable("orderListId") Integer orderListId) {
  // ResponseEntity<? super PutOrderListResponseDto> resposne =
  // orderService.putOrderList(orderListId, requestBody);
  // return resposne;
  // }
}
