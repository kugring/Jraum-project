package com.kugring.back.dto.response.order;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class GetCashNameResponseDto extends ResponseDto {

  private String cashName;

  private GetCashNameResponseDto(String cashName) {
    super();
    this.cashName = cashName;
  }

  // 성공 응답
  public static ResponseEntity<GetCashNameResponseDto> success(String cashName) {
    GetCashNameResponseDto result = new GetCashNameResponseDto(cashName);
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

}
