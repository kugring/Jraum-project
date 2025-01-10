package com.kugring.back.service;
import org.springframework.http.ResponseEntity;

import com.kugring.back.dto.request.point.PointChargeApprovalRequestDto;
import com.kugring.back.dto.request.point.PointChargeDeclineRequestDto;
import com.kugring.back.dto.request.point.PointDirectChargeReuqestDto;
import com.kugring.back.dto.request.point.PostPointChargeRequestDto;
import com.kugring.back.dto.response.point.PostPointChargeResponseDto;
import com.kugring.back.dto.response.point.DeletePointChargeResponseDto;
import com.kugring.back.dto.response.point.GetChargeListResponseDto;
import com.kugring.back.dto.response.point.GetPointChargePendingResponseDto;
import com.kugring.back.dto.response.point.GetPointChargeStatusResponseDto;
import com.kugring.back.dto.response.point.PointChargeApprovalResponseDto;
import com.kugring.back.dto.response.point.PointChargeDeclineResponseDto;
import com.kugring.back.dto.response.point.PointDirectChargeResponseDto;


public interface PointService {
  
  ResponseEntity<? super GetChargeListResponseDto> getChargeList(String userId, int page, int size, String name, String status, String date);
  ResponseEntity<? super PostPointChargeResponseDto> postPointCharge(PostPointChargeRequestDto dto, String userId);
  ResponseEntity<?super PointDirectChargeResponseDto> pointDirectCharge(String userId, PointDirectChargeReuqestDto dto);
  ResponseEntity<? super DeletePointChargeResponseDto> deletePointCharge(Long pointChargeId, String userId);
  ResponseEntity<? super PointChargeDeclineResponseDto> pointChargeDecline(String userId, PointChargeDeclineRequestDto dto);
  ResponseEntity<? super PointChargeApprovalResponseDto> pointChargeApproval(String userId, PointChargeApprovalRequestDto dto);
  ResponseEntity<? super GetPointChargeStatusResponseDto> getPointChargeStatus(String userId);
  ResponseEntity<? super GetPointChargePendingResponseDto> getPointChargePending(String userId);

  
  

  // ResponseEntity<? super CancelPointChargeResponseDto> cancelPointCharge(CancelPointChargeRequestDto dto);
  // ResponseEntity<? super PointDirectChargeResponseDto> pointDirectCharge(PointDirectChargeRequestDto dto);

}
