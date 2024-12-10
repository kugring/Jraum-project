package com.kugring.back.dto.response.point;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;
import lombok.Getter;

@Getter
public class DeletePointChargeResponseDto extends ResponseDto {
    
  private DeletePointChargeResponseDto() {
    super();
  }

  public static ResponseEntity<DeletePointChargeResponseDto> success() {
    DeletePointChargeResponseDto responseBody = new DeletePointChargeResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
  }

  public static ResponseEntity<ResponseDto> DeletePointChargeFail() {
    ResponseDto result = new ResponseDto(ResponseCode.DELETE_POINT_CHARGE_FAIL, ResponseMessage.DELETE_POINT_CHARGE_FAIL);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
  }
}
