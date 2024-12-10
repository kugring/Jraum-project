package com.kugring.back.dto.response.manager;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;

import lombok.Getter;

// 명세서에 기재된 내용:
// extends ResponseDto
//  -success [ 성공 ]
//  -duplicateManagerPin [ 중복되는 매니저 핀 ]
//  -managerCertificationFailed [ 매니저 본인확인 실패 ]

@Getter
public class AddNewManagerResponseDto extends ResponseDto {

    private AddNewManagerResponseDto() {
        super();
    }

    public static ResponseEntity<AddNewManagerResponseDto> success() {
        AddNewManagerResponseDto responseBody = new AddNewManagerResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> duplicateManagerPin() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE_ID, ResponseMessage.DUPLICATE_ID);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> managerCertificationFailed() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.CERTIFICATION_FAIL, ResponseMessage.CERTIFICATION_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }

}
