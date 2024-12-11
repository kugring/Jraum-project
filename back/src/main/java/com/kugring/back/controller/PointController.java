package com.kugring.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kugring.back.dto.request.point.PostPointChargeRequestDto;
import com.kugring.back.dto.response.point.DeletePointChargeResponseDto;
import com.kugring.back.dto.response.point.GetPointChargependingCountResponseDto;
import com.kugring.back.dto.response.point.PostPointChargeResponseDto;
import com.kugring.back.service.PointService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/point")
@RequiredArgsConstructor
public class PointController {

  private final PointService pointService;

  @PostMapping("/charge")
  public ResponseEntity<? super PostPointChargeResponseDto> postPointCharge(
      @RequestBody @Valid PostPointChargeRequestDto requestBody,
      @AuthenticationPrincipal String userId) {
    ResponseEntity<? super PostPointChargeResponseDto> response = pointService.postPointCharge(requestBody, userId);
    return response;
  }

  @GetMapping("/{pointChargeId}/charge/pending/count")
  public ResponseEntity<? super GetPointChargependingCountResponseDto> getPointChargependingCount(
      @PathVariable("pointChargeId") Long pointChargeId,
      @AuthenticationPrincipal String userId) {
    ResponseEntity<? super GetPointChargependingCountResponseDto> response = pointService
        .getPointChargependingCount(pointChargeId, userId);
    return response;
  }

  // @PostMapping("/direct-charge")
  // public ResponseEntity<? super PointDirectChargeResponseDto>
  // pointDirectCharge(@RequestBody @Valid PointDirectChargeRequestDto
  // requestBody) {
  // ResponseEntity<? super PointDirectChargeResponseDto> response =
  // pointService.pointDirectCharge(requestBody);
  // return response;
  // }

  // @PatchMapping("/approve")
  // public ResponseEntity<? super ApprovalPointChargeResponseDto>
  // approvePointCharge(@RequestBody @Valid ApprovalPointChargeRequestDto
  // requestBody) {
  // ResponseEntity<? super ApprovalPointChargeResponseDto> response =
  // pointService.approvePointCharge(requestBody);
  // return response;
  // }

  // @PatchMapping("/cancel")
  // public ResponseEntity<? super CancelPointChargeResponseDto>
  // cancelPointCharge(@RequestBody @Valid CancelPointChargeRequestDto
  // requestBody) {
  // ResponseEntity<? super CancelPointChargeResponseDto> response =
  // pointService.cancelPointCharge(requestBody);
  // return response;
  // }

  @DeleteMapping("/{pointChargeId}")
  public ResponseEntity<? super DeletePointChargeResponseDto>
  deletePointCharge(
  @PathVariable("pointChargeId") Long pointChargeId,
  @AuthenticationPrincipal String userId
  ) {
  ResponseEntity<? super DeletePointChargeResponseDto> response =
  pointService.deletePointCharge(pointChargeId, userId);
  return response;
  }
}
