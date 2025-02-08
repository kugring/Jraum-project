package com.kugring.back.service;

import org.springframework.http.ResponseEntity;

import com.kugring.back.dto.request.order.PatchOrderRefundCancelRequestDto;
import com.kugring.back.dto.request.order.PatchOrderApproveRequestDto;
import com.kugring.back.dto.request.order.PatchOrderRefundRequestDto;
import com.kugring.back.dto.request.order.PostPointOrderRequestDto;
import com.kugring.back.dto.request.order.PostOrderCashRequestDto;
import com.kugring.back.dto.request.order.DeleteOrderRequestDto;
import com.kugring.back.dto.response.order.DeleteOrderResponseDto;
import com.kugring.back.dto.response.order.GetOrderListResponseDto;
import com.kugring.back.dto.response.order.PostOrderCashResponseDto;
import com.kugring.back.dto.response.order.PostPointOrderResponseDto;
import com.kugring.back.dto.response.order.PatchOrderRefundResponseDto;
import com.kugring.back.dto.response.order.PatchOrderApproveResponseDto;
import com.kugring.back.dto.response.order.GetOrderManagementResponseDto;
import com.kugring.back.dto.response.order.PatchOrderRefundCancelResponseDto;


public interface OrderService {

  ResponseEntity<? super DeleteOrderResponseDto> deleteOrder(String managerId, DeleteOrderRequestDto dto);
  ResponseEntity<? super GetOrderListResponseDto> getOrderList(String userId, int page, int size, String name, String status, String date);
  ResponseEntity<? super PostOrderCashResponseDto> postCashOrderList(PostOrderCashRequestDto dto);
  ResponseEntity<? super PostPointOrderResponseDto> postPointOrderList(String user, PostPointOrderRequestDto dto);
  ResponseEntity<? super PatchOrderRefundResponseDto> patchOrderRefund(String userId, PatchOrderRefundRequestDto dto);
  ResponseEntity<? super PatchOrderApproveResponseDto> patchOrderApprove(String userId, PatchOrderApproveRequestDto dto);
  ResponseEntity<? super GetOrderManagementResponseDto> getOrderManagement(String userId);
  ResponseEntity<? super PatchOrderRefundCancelResponseDto> patchOrderRefundCancel(String userId, PatchOrderRefundCancelRequestDto dto);
  
}
