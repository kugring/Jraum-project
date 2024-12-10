package com.kugring.back.provider;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmailProvider {

  private final JavaMailSender javaMailSender;

  private final String SUBJECT = "[젠틀벅 프로젝트 서비스] 인증메일입니다.";

  public boolean sendCertificationMail(String email, String certificationNumber) { // 전송한 이메일 인증번호

    try {
      MimeMessage message = javaMailSender.createMimeMessage(); // 이메일을 담을 객체 생성
      MimeMessageHelper messageHelper = new MimeMessageHelper(message, true); // 이메일 전송에 필요한 헬퍼를 생성

      String htmlContent = getCertificationMessage(certificationNumber);

      messageHelper.setTo(email); // 이메일을 어디로 보낼것인가!
      messageHelper.setSubject(SUBJECT); // 이메일의 제목은 어떻게 할것인가?
      messageHelper.setText(htmlContent, true); // 이메일의 제목은 어떻게 할것인가?

      javaMailSender.send(message);
    } catch (Exception exception) {
      exception.printStackTrace();
      return false;
    }

    return true;

  }

  private String getCertificationMessage(String certificationNumber) {
    String certificationMessage = "";
    certificationMessage += "<h1 style='text-align:center;'>[젠틀벅 프로젝트 서비스] 인증메일</h1>";
    certificationMessage += "<h3 style='text-align:center;'>인증코드 : <strong style='font-size:32px; letter-spacing: 8px;'>" + certificationNumber + "</strong></h3>";
    return certificationMessage;
  }
}
