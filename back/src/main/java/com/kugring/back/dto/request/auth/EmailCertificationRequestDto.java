package com.kugring.back.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor // 다른 생성자를 생성했을때에 자동으로 ()매개변수를 안받는 생성자를 컴파일러가 만들지 않아버리지만 NoArgsConstructor를 사용하면
                   // 다른 생성자가 있어도 기본생성자를
                   // 만든다!
public class EmailCertificationRequestDto {

  @NotBlank
  private String id;

  @Email
  @NotBlank
  private String email;
}
