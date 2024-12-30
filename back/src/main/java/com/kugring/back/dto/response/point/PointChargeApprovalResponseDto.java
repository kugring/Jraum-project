package com.kugring.back.dto.response.point;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;
import lombok.Getter;

@Getter
public class PointChargeApprovalResponseDto extends ResponseDto {
    
  private PointChargeApprovalResponseDto() {
    super();
  }

  public static ResponseEntity<PointChargeApprovalResponseDto> success() {
    PointChargeApprovalResponseDto responseBody = new PointChargeApprovalResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
  }

  public static ResponseEntity<ResponseDto> notExistedManager() {
    ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_MANAGER, ResponseMessage.NOT_EXISTED_MANAGER);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
  }
}
