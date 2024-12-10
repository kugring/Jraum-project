package com.kugring.back.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.kugring.back.dto.response.ResponseDto;

// RestControllerAdvice는 예외처리와 전역 데이터 바인딩과 전역적으로 적용을 담당한다.
@RestControllerAdvice
public class VaildationExceptionHandler {

  // 파라미터로 예외처리의 경우를 받아서 커스텀하여 원하는 예외처리를 반환 할 수 있다.
  @ExceptionHandler({MethodArgumentNotValidException.class, HttpMessageNotReadableException.class})
  public ResponseEntity<ResponseDto> vaildationExceptionHandler(Exception exception) {
    return ResponseDto.vaildationFail();
  }
}
