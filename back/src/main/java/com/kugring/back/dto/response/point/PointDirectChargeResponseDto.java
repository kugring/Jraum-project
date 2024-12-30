package com.kugring.back.dto.response.point;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;
import lombok.Getter;

@Getter
public class PointDirectChargeResponseDto extends ResponseDto {
    
  private PointDirectChargeResponseDto() {
    super();
  }

  public static ResponseEntity<PointDirectChargeResponseDto> success() {
    PointDirectChargeResponseDto responseBody = new PointDirectChargeResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
  }

  public static ResponseEntity<ResponseDto> notExistedManager() {
    ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_MANAGER, ResponseMessage.NOT_EXISTED_MANAGER);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
  }

  public static ResponseEntity<ResponseDto> noExistUser() {
    ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
  }
}
