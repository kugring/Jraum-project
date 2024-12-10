package com.kugring.back.dto.response.menu;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;

public class PostMenuResponseDto extends ResponseDto {


  private PostMenuResponseDto() {
    super();
  }

  // 성공 응답
  public static ResponseEntity<PostMenuResponseDto> success() {
    PostMenuResponseDto result = new PostMenuResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

    // 실패 응답 (Menu create Fail)
    public static ResponseEntity<ResponseDto> menuCreateFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.MENU_CREATE_FAIL, ResponseMessage.MENU_CREATE_FAIL);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
