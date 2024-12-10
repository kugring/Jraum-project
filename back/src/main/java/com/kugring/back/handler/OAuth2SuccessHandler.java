package com.kugring.back.handler;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.kugring.back.entity.CustomOAuth2User;
import com.kugring.back.provider.JwtProvider;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

  private final JwtProvider jwtProvider;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication // 이건 오버라이드하고 이후에 따로
                                                                                                                              // spring security 따로
                                                                                                                              // 임포트 해줬다!
  ) throws IOException, ServletException { // 이것도 그냥 임포트해줌 import java.io.IOException;

    CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

    String userId = oAuth2User.getName(); // 이것으로 userId를 꺼내온다.
    String token = jwtProvider.create(userId);

    response.sendRedirect("http://localhost:3000/auth/oauth-response/" + token + "/3600");

  }
}
