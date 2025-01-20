package com.kugring.back.dto.request.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JraumSignUpRequestDto {

  private int point;
  private String pin;
  private String name;
  private String division;
  private String position;
  private String nickname;
  private String phoneNumber;
  private String initialName;
  private String profileImage;

}
