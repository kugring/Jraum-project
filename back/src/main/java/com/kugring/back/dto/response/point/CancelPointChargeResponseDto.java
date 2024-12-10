package com.kugring.back.dto.response.point;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class CancelPointChargeResponseDto extends ResponseDto {

  private CancelPointChargeResponseDto() {
    super();
  }

  public static ResponseEntity<CancelPointChargeResponseDto> success() {
    CancelPointChargeResponseDto responseBody = new CancelPointChargeResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
  }

  public static ResponseEntity<ResponseDto> CancelPointChargeFail() {
    ResponseDto result = new ResponseDto(ResponseCode.CANCEL_POINT_CHARGE_FAIL, ResponseMessage.CANCEL_POINT_CHARGE_FAIL);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
  }
}


