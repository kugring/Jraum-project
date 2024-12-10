package com.kugring.back.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.kugring.back.filter.JwtAuthenticationFilter;
import com.kugring.back.handler.OAuth2SuccessHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configurable // 어노테이션 Bean을 등록할 수 있도록 한다.
@Configuration // WebSecurityConfig라는 클래스가 bean이라는 메소드를 가지고 있다라는 설정
@EnableWebSecurity // 웹시큐리에 대한 설정을 맞춘다라는 이노테이션
@RequiredArgsConstructor // 의존성 주입을 제어 역전하기 위해서 사용한다는데 무슨말인지 도저히 모르겠다....
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final DefaultOAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception {

        // 전반적인 Security의 설정을 한다.
        httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource())).csrf(CsrfConfigurer::disable).httpBasic(HttpBasicConfigurer::disable) // 여기 프로젝트에서는
                // Bearer토큰 방식을
                // 사용하기
                // 때문에 기본으로 스프링
                // 시큐리티가
                // 설정해주는
                // httpBasic을
                // 사용하지
                // 않는다.
                .sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // stattless라고 지정하면 세션을 유지하지
                        // 않겠다라는 의미이다.
                        // (세션을 이번 프로젝트에서 사용하지 않는다.)
                )
                .authorizeHttpRequests(request -> request
                                .requestMatchers("/", "/api/v1/auth/**", "/oauth2/**", "/api/v1/board/**", "/api/v1/point/**", "/api/v1/menu/**", "/api/v1/user/**", "/api/v1/order/**", "/api/v1/option/**", "/api/v1/manager/**")
                                .permitAll().requestMatchers("/api/v1/user/**").hasRole("USER").requestMatchers("/api/v1/admin/**").hasRole("ADMIN").anyRequest().authenticated() // 위에
                        // 경로를
                        // 제외한
                        // 모든것에서는
                        // 권한을
                        // 확인하겠다!라는
                        // 의미.

                        // todo 만일 권한이 없는 사람이 접속시 다른곳으로 redirect할 경로 설정하기
                        // todo 같은 계정으로 2명 이상이 접속시 처리될 코드 작성하기
                )

                // 카카오톡, 네이버 sns 사용을 위한 코드
                .oauth2Login(oauth2 -> oauth2.authorizationEndpoint(endpoint -> endpoint.baseUri("/api/v1/auth/oauth2"))
                                .redirectionEndpoint(endpoint -> endpoint.baseUri("/oauth2/callback/*")).userInfoEndpoint(endpoint -> endpoint.userService(oAuth2UserService))
                                .successHandler(oAuth2SuccessHandler) // successHandler의 파라미터로 우리가
                        // 커스텀한
                        // auth2SuccessHandler이라는 데이터를
                        // 전해준다.
                )

                // 만일 권한을 확인함에 있어서 권한이 확인에 실패하는 경우 repsone값을 전달한다.
                .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(new FailedAuthenticationEntryPoint()))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // 로그아웃 진행하는 코드
                .logout(logout -> logout.logoutUrl("/logout").logoutSuccessHandler(logoutSuccessHandler()).permitAll());
        ;

        return httpSecurity.build();
    }

    @Bean
    protected LogoutSuccessHandler logoutSuccessHandler() {
        return new SimpleUrlLogoutSuccessHandler(); // 로그아웃 후 홈 페이지로 리디렉션
    }


    @Bean
    protected CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration corsConfiguration = new CorsConfiguration();
        // 반환할 configurationSource이다. UrlBased가 뭘까? 인스턴트 생성이라고 하네?
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();


        //모든 ip에 응답 허용
        corsConfiguration.addAllowedOriginPattern("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");
        //내 서버의 응답 json 을 javascript에서 처리할수 있게 하는것(axios 등)
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setMaxAge(3600L);

        source.registerCorsConfiguration("/**", corsConfiguration);

        return source;
    }
}


// 상단 authorizeHttpRequests에서 hasRole이나 권한에 대해서 실패가 이루어지는 경우 발행하는 코드
class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // SC_FORBIDDEN 권한없음을 나타냄
        //
        response.getWriter().write("{\"code\": \"NP\", \"message\": \"No permission.\"}");
    }

}
