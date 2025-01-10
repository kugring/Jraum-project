package com.kugring.back.dto.response.point;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class GetPointChargeStatusResponseDto extends ResponseDto {

    private String status;
    private Long pointChargeId;

    private GetPointChargeStatusResponseDto(String status, Long pointChargeId) {
        super();
        this.status = status;
        this.pointChargeId = pointChargeId;
    }

    public static ResponseEntity<GetPointChargeStatusResponseDto> success(String status, Long pointChargeId) {
        GetPointChargeStatusResponseDto responseBody = new GetPointChargeStatusResponseDto(status, pointChargeId);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> noExistPointCharge() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_POINT_CHARGE, ResponseMessage.NOT_EXISTED_POINT_CHARGE);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }

}
