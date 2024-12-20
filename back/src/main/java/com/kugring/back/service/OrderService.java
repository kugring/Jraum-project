package com.kugring.back.service;

import org.springframework.http.ResponseEntity;

import com.kugring.back.dto.request.order.PatchOrderApproveRequestDto;
import com.kugring.back.dto.request.order.PostOrderCashRequestDto;
import com.kugring.back.dto.request.order.PostPointOrderRequestDto;
import com.kugring.back.dto.response.order.GetCashNameResponseDto;
import com.kugring.back.dto.response.order.GetOrderListResponseDto;
import com.kugring.back.dto.response.order.GetOrderManagementResponseDto;
import com.kugring.back.dto.response.order.PatchOrderApproveResponseDto;
import com.kugring.back.dto.response.order.PostOrderCashResponseDto;
import com.kugring.back.dto.response.order.PostPointOrderResponseDto;


public interface OrderService {

  // ResponseEntity<? super FilterOrderListResponseDto> filterOrderList(FilterOrderListRequestDto dto);

  ResponseEntity<? super GetCashNameResponseDto> getCashName();
  ResponseEntity<? super GetOrderListResponseDto> getOrderList(String userId, int page, int size);
  ResponseEntity<? super PostOrderCashResponseDto> postCashOrderList(PostOrderCashRequestDto dto);
  ResponseEntity<? super PostPointOrderResponseDto> postPointOrderList(String user, PostPointOrderRequestDto dto);
  ResponseEntity<? super PatchOrderApproveResponseDto> patchOrderApprove(String userId, PatchOrderApproveRequestDto dto);
  ResponseEntity<? super GetOrderManagementResponseDto> getOrderManagement(String userId);


  
  // ResponseEntity<? super PutOrderListResponseDto> putOrderList(Integer orderListId, PutOrderListRequestDto dto);



}
