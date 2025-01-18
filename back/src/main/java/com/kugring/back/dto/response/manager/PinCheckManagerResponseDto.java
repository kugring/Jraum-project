package com.kugring.back.dto.response.manager;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.entity.User;

import lombok.Getter;

@Getter
public class PinCheckManagerResponseDto extends ResponseDto {

    private User user = new User();
    private String token;
    private int point;
    private int expirationTime;

    private PinCheckManagerResponseDto(User user, String token) {

        super(); // 이놈이 가장 위에 있어야 오류 없이 작동한다.
        this.token = token;
        this.expirationTime =  60 * 60 * 24 * 30 * 3;
        this.user.setName(user.getName());
    }

    public static ResponseEntity<PinCheckManagerResponseDto> success(User user, String token) {
        PinCheckManagerResponseDto result = new PinCheckManagerResponseDto(user, token);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> pinCheckFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.PIN_CHECK_FAIL, ResponseMessage.PIN_CHECK_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }
}
