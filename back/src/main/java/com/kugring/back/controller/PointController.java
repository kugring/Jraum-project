package com.kugring.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kugring.back.dto.request.point.PointChargeApprovalRequestDto;
import com.kugring.back.dto.request.point.PointChargeDeclineRequestDto;
import com.kugring.back.dto.request.point.PointDirectChargeReuqestDto;
import com.kugring.back.dto.request.point.PostPointChargeRequestDto;
import com.kugring.back.dto.response.point.DeletePointChargeResponseDto;
import com.kugring.back.dto.response.point.GetChargeListResponseDto;
import com.kugring.back.dto.response.point.GetPointChargePendingResponseDto;
import com.kugring.back.dto.response.point.GetPointChargeStatusResponseDto;
import com.kugring.back.dto.response.point.PointChargeApprovalResponseDto;
import com.kugring.back.dto.response.point.PointChargeDeclineResponseDto;
import com.kugring.back.dto.response.point.PointDirectChargeResponseDto;
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

  @PostMapping("/manager/charge/direct")
  public ResponseEntity<? super PointDirectChargeResponseDto> pointDirectCharge(
      @RequestBody @Valid PointDirectChargeReuqestDto requestBody,
      @AuthenticationPrincipal String userId) {
    ResponseEntity<? super PointDirectChargeResponseDto> response = pointService.pointDirectCharge(userId, requestBody);
    return response;
  }

  @GetMapping("/charge/status")
  public ResponseEntity<? super GetPointChargeStatusResponseDto> getPointChargeStatus(
      @AuthenticationPrincipal String userId) {
    ResponseEntity<? super GetPointChargeStatusResponseDto> response = pointService.getPointChargeStatus(userId);
    return response;
  }

  @GetMapping("/manager/charge/pending")
  public ResponseEntity<? super GetPointChargePendingResponseDto> getPointChargePending(
      @AuthenticationPrincipal String userId) {
    ResponseEntity<? super GetPointChargePendingResponseDto> response = pointService.getPointChargePending(userId);
    return response;
  }

  @GetMapping("/manager/charge/list")
  public ResponseEntity<? super GetChargeListResponseDto> getChargeList(
      @AuthenticationPrincipal String userId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) String name,
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String date) {
    ResponseEntity<? super GetChargeListResponseDto> response = pointService.getChargeList(userId, page, size, name,
        status, date);
    return response;
  }

  @PatchMapping("/approve")
  public ResponseEntity<? super PointChargeApprovalResponseDto> pointChargeApproval(
      @RequestBody @Valid PointChargeApprovalRequestDto requestBody,
      @AuthenticationPrincipal String userId) {
    ResponseEntity<? super PointChargeApprovalResponseDto> response = pointService.pointChargeApproval(userId,
        requestBody);
    return response;
  }

  @PatchMapping("/decline")
  public ResponseEntity<? super PointChargeDeclineResponseDto> pointChargeDecline(
      @RequestBody @Valid PointChargeDeclineRequestDto requestBody,
      @AuthenticationPrincipal String userId) {
    ResponseEntity<? super PointChargeDeclineResponseDto> response = pointService.pointChargeDecline(userId,
        requestBody);
    return response;
  }

  // @PatchMapping("/cancel")
  // public ResponseEntity<? super CancelPointChargeResponseDto>
  // cancelPointCharge(@RequestBody @Valid CancelPointChargeRequestDto
  // requestBody) {
  // ResponseEntity<? super CancelPointChargeResponseDto> response =
  // pointService.cancelPointCharge(requestBody);
  // return response;
  // }

  @DeleteMapping("/{pointChargeId}")
  public ResponseEntity<? super DeletePointChargeResponseDto> deletePointCharge(
      @PathVariable("pointChargeId") Long pointChargeId,
      @AuthenticationPrincipal String userId) {
    ResponseEntity<? super DeletePointChargeResponseDto> response = pointService.deletePointCharge(pointChargeId,
        userId);
    return response;
  }
}
