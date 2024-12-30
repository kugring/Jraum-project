package com.kugring.back.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class PinDpCheckResponseDto extends ResponseDto {

  private PinDpCheckResponseDto() {
    super();
  }

  public static ResponseEntity<PinDpCheckResponseDto> success() {
    PinDpCheckResponseDto responseBody = new PinDpCheckResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
  }

  public static ResponseEntity<ResponseDto> duplicatePin() {
    ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE_PIN, ResponseMessage.DUPLICATE_PIN);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
  }
}
