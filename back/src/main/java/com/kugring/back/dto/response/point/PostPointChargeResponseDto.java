package com.kugring.back.dto.response.point;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.object.PointChargeRequestListItem;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.entity.PointCharge;

import lombok.Getter;

@Getter
public class PostPointChargeResponseDto extends ResponseDto {

  PointChargeRequestListItem pointChargeRequest = null;

  private PostPointChargeResponseDto(PointCharge PointCharge) {
    super();
    this.pointChargeRequest = new PointChargeRequestListItem(PointCharge);
  }

  public static ResponseEntity<PostPointChargeResponseDto> success(PointCharge PointCharge) {
    PostPointChargeResponseDto responseBody = new PostPointChargeResponseDto(PointCharge);
    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
  }

  public static ResponseEntity<ResponseDto> pointChargeFail() {
    ResponseDto responseBody = new ResponseDto(ResponseCode.POINT_CHARGE_FAIL, ResponseMessage.POINT_CHARGE_FAIL);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
  }

  public static ResponseEntity<ResponseDto> noExistUser() {
    ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
  }
}


