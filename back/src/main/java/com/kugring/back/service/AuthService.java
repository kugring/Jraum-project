package com.kugring.back.service;

import org.springframework.http.ResponseEntity;

import com.kugring.back.dto.request.auth.JraumSignUpRequestDto;
import com.kugring.back.dto.request.auth.NicknameDpCheckRequestDto;
import com.kugring.back.dto.request.auth.PinCheckRequestDto;
import com.kugring.back.dto.request.auth.PinDpCheckRequestDto;
import com.kugring.back.dto.response.auth.JraumSignUpResponseDto;
import com.kugring.back.dto.response.auth.NicknameDpCheckResponseDto;
import com.kugring.back.dto.response.auth.PinCheckResponseDto;
import com.kugring.back.dto.response.auth.PinDpCheckResponseDto;
import com.kugring.back.dto.response.manager.PinCheckManagerResponseDto;


public interface AuthService {

//   ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto);

//   ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto);

//   ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto);

//   ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);

//   ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);


  ResponseEntity<? super PinCheckResponseDto> pinCheck(PinCheckRequestDto dto);
  ResponseEntity<? super PinDpCheckResponseDto> pinDpCheck(String userId, PinDpCheckRequestDto dto);
  ResponseEntity<? super JraumSignUpResponseDto> jraumSignUp(String userId, JraumSignUpRequestDto dto);
  ResponseEntity<? super NicknameDpCheckResponseDto> nicknameDpCheck(String userId, NicknameDpCheckRequestDto dto);
  ResponseEntity<? super PinCheckManagerResponseDto> managerPinCheck(PinCheckRequestDto dto);

  
}
