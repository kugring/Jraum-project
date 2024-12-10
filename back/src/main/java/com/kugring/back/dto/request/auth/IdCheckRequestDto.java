package com.kugring.back.dto.request.auth;

import com.kugring.back.dto.response.ResponseDto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class IdCheckRequestDto extends ResponseDto {

  @NotBlank
  private String id;

}
