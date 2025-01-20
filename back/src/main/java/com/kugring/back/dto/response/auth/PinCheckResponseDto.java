package com.kugring.back.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.entity.User;
import lombok.Getter;

@Getter
public class PinCheckResponseDto extends ResponseDto {

    private User user = new User();
    private String token;
    private int point;
    private int expirationTime;

    private PinCheckResponseDto(User user, String token) {

        super(); // 이놈이 가장 위에 있어야 오류 없이 작동한다.
        this.token = token;
        this.expirationTime = 60 * 60 * 24 * 30 * 3;
        this.user.setName(user.getName());
        this.user.setPoint(user.getPoint());
        this.user.setDivision(user.getDivision());
        this.user.setNickname(user.getNickname());
        this.user.setPosition(user.getPosition());
        this.user.setProfileImage(user.getProfileImage());
}

    public static ResponseEntity<PinCheckResponseDto> success(User user, String token) {
        PinCheckResponseDto result = new PinCheckResponseDto(user, token);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }


    public static ResponseEntity<ResponseDto> pinCheckFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.PIN_CHECK_FAIL, ResponseMessage.PIN_CHECK_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }
}
