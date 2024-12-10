package com.kugring.back.entity;

import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

// 일부러 커스텀을 한 이유에 대해서는 아직 모르겠다!
@NoArgsConstructor
@AllArgsConstructor
public class CustomOAuth2User implements OAuth2User {

  private String userId;


  @Override
  public Map<String, Object> getAttributes() {
    return null;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return null;
  }

  @Override
  public String getName() {
    return this.userId;
  }

}
