package com.kugring.back.dto.response.menu;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.response.ResponseDto;

public class PatchMenuSequenceResponseDto extends ResponseDto {

  private PatchMenuSequenceResponseDto() {
    super();
  }

  // 성공 응답
  public static ResponseEntity<PatchMenuSequenceResponseDto> success() {
    PatchMenuSequenceResponseDto result = new PatchMenuSequenceResponseDto();
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

    // 실패 응답 (메뉴 없음)
    public static ResponseEntity<ResponseDto> notExistedMenu() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NOT_EXISTED_MENU, ResponseMessage.NOT_EXISTED_MENU);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
    // 실패 응답 (매니저 아님)
    public static ResponseEntity<ResponseDto> notExistedManager() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NOT_EXISTED_MANAGER, ResponseMessage.NOT_EXISTED_MANAGER);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
