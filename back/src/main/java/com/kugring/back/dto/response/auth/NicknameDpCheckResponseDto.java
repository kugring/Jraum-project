package com.kugring.back.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class NicknameDpCheckResponseDto extends ResponseDto {

  private NicknameDpCheckResponseDto() {
    super();
  }

  public static ResponseEntity<NicknameDpCheckResponseDto> success() {
    NicknameDpCheckResponseDto responseBody = new NicknameDpCheckResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
  }

  public static ResponseEntity<ResponseDto> duplicateNickname() {
    ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE_NICKNAME, ResponseMessage.DUPLICATE_NICKNAME);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
  }
}
