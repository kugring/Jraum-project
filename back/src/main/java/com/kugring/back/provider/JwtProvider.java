package com.kugring.back.provider;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.nio.charset.StandardCharsets;

@Component
public class JwtProvider {

  @Value("${secret-key}")
  private String secretKey;

  public String create(String userId) {
    Date expiredDate = Date.from(Instant.now().plus(1, ChronoUnit.HOURS)); // 이코드가 해당 토큰을 1시간으로 지정하는 듯하다!
    Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)); // 이 코드는 application.properties의
                                                                              // secretKey를 가져다 무언가를 하는듯하다!
    String jwt = Jwts
        .builder()
        .signWith(key, SignatureAlgorithm.HS256)
        .setSubject(userId)
        .setIssuedAt(new Date())
        .setExpiration(expiredDate)
        .compact();
    return jwt;

  }

  // Bearer 토큰의 7번째 단어로부의 값을 파라미터로 받아서 해당 token이 가지고 있는 데이터를 확인한다.
  public String validate(String jwt) {

    String subject = null;
    Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

    try {
      subject = Jwts
          .parserBuilder() // json토큰웹에 대한것 같다?
          .setSigningKey(key)
          .build()
          .parseClaimsJws(jwt)
          .getBody()
          .getSubject();

    } catch (Exception exception) {
      exception.printStackTrace();
      return null;
    }
    return subject;
  }
}
