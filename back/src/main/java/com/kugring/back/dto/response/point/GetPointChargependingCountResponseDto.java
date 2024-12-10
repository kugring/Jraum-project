package com.kugring.back.dto.response.point;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class GetPointChargependingCountResponseDto extends ResponseDto {

    private boolean approve;

    private GetPointChargependingCountResponseDto(boolean approve) {
        super();
        this.approve = approve;
    }

    public static ResponseEntity<GetPointChargependingCountResponseDto> success(boolean approve) {
        GetPointChargependingCountResponseDto responseBody = new GetPointChargependingCountResponseDto(approve);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> noExistUser() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }

}
