package com.kugring.back.dto.response.order;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class GetCashNameResponseDto extends ResponseDto {

  private String biblePerson;

  private GetCashNameResponseDto(String biblePerson) {
    super();
    this.biblePerson = biblePerson;
  }

  // 성공 응답
  public static ResponseEntity<GetCashNameResponseDto> success(String biblePerson) {
    GetCashNameResponseDto result = new GetCashNameResponseDto(biblePerson);
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

}
