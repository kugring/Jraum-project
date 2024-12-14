package com.kugring.back.dto.response.order;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class PatchOrderApproveResponseDto extends ResponseDto {

  private PatchOrderApproveResponseDto() {
    super();
  }

  // 성공 응답
  public static ResponseEntity<PatchOrderApproveResponseDto> success() {
    PatchOrderApproveResponseDto result = new PatchOrderApproveResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

  // 실패 응답 (관리자 실패)
  public static ResponseEntity<ResponseDto> managerNotExisted() {
    ResponseDto responseBody = new ResponseDto(ResponseCode.NOT_EXISTED_MANAGER, ResponseMessage.NOT_EXISTED_MANAGER);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
  }

  // 실패 응답 (주문 없음)
  public static ResponseEntity<ResponseDto> noExistOrder() {
    ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_ORDER, ResponseMessage.NOT_EXISTED_ORDER);
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
  }

}
