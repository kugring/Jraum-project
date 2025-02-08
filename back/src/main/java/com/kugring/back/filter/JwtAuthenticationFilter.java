package com.kugring.back.filter;

import java.io.IOException;
import java.util.List;
import java.util.ArrayList;

import org.springframework.util.StringUtils;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.kugring.back.entity.User;
import com.kugring.back.provider.JwtProvider;
import com.kugring.back.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor // 이런 이노테이션을 사용하면 autowired가 필요없이 해당 클래스가 필요로하는 파라미터를 알아서 autowired해준다.
public class JwtAuthenticationFilter extends OncePerRequestFilter {  // 해당 클래스를 필터로 사용하기 위해서는 추상메서드를 확장해준다?

  private final UserRepository userRepository;
  private final JwtProvider jwtProvider;

  @SuppressWarnings("null")
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

    try {
      // 아래쪽에 parseBearerToken를 통해서 헤더의 authorization값의 토큰을 가져온다.
      String token = parseBearerToken(request); 

      // 만일 토큰값이 null이라면 {authorization이 아니거나, Bearer토큰의 형식이 아닌경우}다음 필터로 넘겨버린다.
      if (token == null) { 
        filterChain.doFilter(request, response);
        return;
      }

      String userId = jwtProvider.validate(token);
      if (userId == null) {
        filterChain.doFilter(request, response);
        return;
      }

      User User = userRepository.findByUserId(userId);
      String role = User.getRole(); // role: ROLE_USER, ROLE_ADMIN 스프링 시큐리에 접근하는 권한에 관련된 변수는 접두사인 "ROLE_"를 붙이게 된다.


      // ROLE_DEVELOPER, ROLE_BOSS
      List<GrantedAuthority> authorities = new ArrayList<>(); // 스프링 시큐리티의 GrantedAuthority
      authorities.add(new SimpleGrantedAuthority(role));

      // 스프링 CONTEXT에 데이터를 보내줄 시큐리티콘텍스트를 생성한다.
      SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

      // 시큐리티콘텍스트에 들어갈 사용자권한에 관련된 토큰을 생성하고 JWT토큰에 있었던 userId값과 접근권한자_리스트가 담는다.
      // 접근 주체에 대한 토큰 정보, 담겨지는 파라마터는 (해당 정보, 비밀번호, 시큐리에 접근하는 권한자의 리스트)
      AbstractAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userId, null, authorities);
      authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); // 요청을 담는다?

      // 시큐리티콘텍스트의 authenticationToken을 담는다.
      securityContext.setAuthentication(authenticationToken);

      // 시큐리티콘텍스트를 request에 등록한다?
      SecurityContextHolder.setContext(securityContext);
      

    } catch (Exception exception) {
      exception.printStackTrace();
    }
    // 다음 필터로 넘어갈 수 있도록 한다?? 라는게 무슨 말이지...? 이번 필터가 끝나고 이어서 다음 필터로 넘어간다는 얘기인가?
    filterChain.doFilter(request, response);
  }

  // hearder로부터 Authorizaion이라는 토근을 가져올꺼고 그 토근이 Bearer토큰이 맞는지! null은 아닌지 값을 확인해서 토큰을 String타입으로 반환 받는다.
  private String parseBearerToken(HttpServletRequest request) {

    String authorization = request.getHeader("Authorization");
  
    // hasText는 해당 String이 null 아닌지 length가 0은 아닌지 whiteSpace로 공백은 아닌지 확인해줌
    boolean hasAuthorization = StringUtils.hasText(authorization);
    if (!hasAuthorization)
      return null;

    boolean isBearer = authorization.startsWith("Bearer "); // 여기로 부터 7번째 이후 단어를 가져온다는 의미
    if (!isBearer)
      return null;

    String token = authorization.substring(7); // 7에 대한 값은 "Bearer "라는 단어의 7번째 단어부터 읽어오라는 의미이다.
    return token;
  }
}
