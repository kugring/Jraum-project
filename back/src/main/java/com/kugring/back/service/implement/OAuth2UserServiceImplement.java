package com.kugring.back.service.implement;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.kugring.back.entity.CustomOAuth2User;
import com.kugring.back.entity.User;
import com.kugring.back.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OAuth2UserServiceImplement extends DefaultOAuth2UserService {

  private final UserRepository UserRepository;

  @SuppressWarnings({"unchecked", "null"})
  @Override
  public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {

    OAuth2User oAuth2User = super.loadUser(request); // 슈퍼에서 로드유저로 request를 던지면 그 결과를 받을 수 있다!
    String oauthClientName = request.getClientRegistration().getClientName(); // 해당 SNS API의 이름을
                                                                              // 가져온다!


    // try {
    // // 해당 sns API에서 가져오는 데이터를 가공하지 안혹 그대로 출력했을때 print코드
    // System.out.println(new ObjectMapper().writeValueAsString(oAuth2User.getAttributes()));
    // } catch (Exception exception) {
    // exception.printStackTrace();
    // }

    // 새롭게 회원가입을 하는 경우 회원 가입의 경로가 kakao인지 naver인지 구별해서 반환되는 데이터를 따로 해석해서 entity로 기입하고 repos로 저장한다.
    User User = null;
    String userId = null;
    String email = "email@email.com";

    if (oauthClientName.equals("kakao")) {
      userId = "kakao_" + oAuth2User.getAttributes().get("id");
      User = new User(userId, email, "kakao");

    }
    if (oauthClientName.equals("naver")) {
      Map<String, String> responseMap = (Map<String, String>) oAuth2User.getAttributes().get("response");
      userId = "naver_" + responseMap.get("id").substring(0, 14); // 네이버에서 가져오는 id값이 너무 길기 때문에 15글자만
                                                                  // 가져온다.
      email = responseMap.get("email");
      User = new User(userId, email, "naver");
    }

    UserRepository.save(User);

    return new CustomOAuth2User(userId);
  }
}
