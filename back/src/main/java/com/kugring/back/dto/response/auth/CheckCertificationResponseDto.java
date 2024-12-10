package com.kugring.back.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class CheckCertificationResponseDto extends ResponseDto {

  private CheckCertificationResponseDto() {
    super();
  };

  // 인증에 성공했을때 반환할 함수
  public static ResponseEntity<CheckCertificationResponseDto> success() {
    CheckCertificationResponseDto responseBody = new CheckCertificationResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
  }

  // 인증에 실패했을때 반환할 함수
  public static ResponseEntity<ResponseDto> certificationFail() {
    ResponseDto responseBody = new ResponseDto(ResponseCode.CERTIFICATION_FAIL, ResponseMessage.CERTIFICATION_FAIL);

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
  }

}
