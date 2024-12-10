package com.kugring.back.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kugring.back.dto.request.auth.PinCheckRequestDto;
import com.kugring.back.dto.response.auth.PinCheckResponseDto;
import com.kugring.back.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController // controller가 아니라 RestController로 지정한 이유는 이렇게 해야 ResponseBody 반환해주기 때문이다.
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

//   @PostMapping("/id-check")
//   public ResponseEntity<? super IdCheckResponseDto> idCheck(@RequestBody @Valid IdCheckRequestDto requestBody) {
//     ResponseEntity<? super IdCheckResponseDto> response = authService.idCheck(requestBody);
//     return response;
//   }

//   @PostMapping("/email-certification")
//   public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(@RequestBody @Valid EmailCertificationRequestDto requestBody) {
//     ResponseEntity<? super EmailCertificationResponseDto> response = authService.emailCertification(requestBody);
//     return response;
//   }

//   @PostMapping("/check-certification")
//   public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(@RequestBody @Valid CheckCertificationRequestDto requestBody) {
//     ResponseEntity<? super CheckCertificationResponseDto> response = authService.checkCertification(requestBody);
//     return response;
//   }

//   @PostMapping("/sign-up")
//   public ResponseEntity<? super SignUpResponseDto> signUp(@RequestBody @Valid SignUpRequestDto requestBody) {
//     ResponseEntity<? super SignUpResponseDto> response = authService.signUp(requestBody);
//     return response;
//   }

  // @PostMapping("/sign-in")
  // public ResponseEntity<? super SignInResponseDto> signIn(@RequestBody @Valid SignInRequestDto requestBody) {
  //   ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody);
  //   return response;
  // }

  @PostMapping("/pin-check")
  public ResponseEntity<? super PinCheckResponseDto> pinCheck(@RequestBody @Valid PinCheckRequestDto requestBody) {
    ResponseEntity<? super PinCheckResponseDto> response = authService.pinCheck(requestBody);
    return response;
  }
}
