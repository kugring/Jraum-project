package com.kugring.back.service;

import org.springframework.http.ResponseEntity;

import com.kugring.back.dto.request.auth.PinCheckRequestDto;
import com.kugring.back.dto.response.auth.PinCheckResponseDto;


public interface AuthService {

//   ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto);

//   ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto);

//   ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto);

//   ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);

//   ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);

  ResponseEntity<? super PinCheckResponseDto> pinCheck(PinCheckRequestDto dto);

}
