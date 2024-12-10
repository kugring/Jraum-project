package com.kugring.back.service;

import org.springframework.http.ResponseEntity;

import com.kugring.back.dto.request.point.PostPointChargeRequestDto;
import com.kugring.back.dto.response.point.DeletePointChargeResponseDto;
import com.kugring.back.dto.response.point.GetPointChargependingCountResponseDto;
import com.kugring.back.dto.response.point.PostPointChargeResponseDto;


public interface PointService {

  ResponseEntity<? super PostPointChargeResponseDto> postPointCharge(PostPointChargeRequestDto dto, String userId);

  ResponseEntity<? super GetPointChargependingCountResponseDto> getPointChargependingCount(Long pointChargeId, String userId);

  ResponseEntity<? super DeletePointChargeResponseDto> deletePointCharge(Long pointChargeId, String userId);


  

  // ResponseEntity<? super CancelPointChargeResponseDto> cancelPointCharge(CancelPointChargeRequestDto dto);

  // ResponseEntity<? super PointDirectChargeResponseDto> pointDirectCharge(PointDirectChargeRequestDto dto);


  // ResponseEntity<? super ApprovalPointChargeResponseDto> approvePointCharge(ApprovalPointChargeRequestDto dto);

}
