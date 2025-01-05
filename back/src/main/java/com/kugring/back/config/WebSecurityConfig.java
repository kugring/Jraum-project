package com.kugring.back.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
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
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(request -> request
                        // WebSocket 엔드포인트 허용, JwtAuthenticationFilter를 거치지 않음
                        .requestMatchers("/ws/**").permitAll()

                        // 기존 API 경로 설정
                        .requestMatchers(
                                "/", "/api/v1/auth/**", "/oauth2/**", "/api/v1/board/**",
                                "/api/v1/point/**", "/api/v1/menu/**", "/api/v1/user/**",
                                "/api/v1/order/**", "/api/v1/option/**", "/api/v1/manager/**",
                                "/file/**" // /file 경로와 하위 모든 경로 허용
                        )
                        .permitAll()

                        // 권한이 필요한 요청 설정
                        .requestMatchers("/api/v1/user/**").hasRole("USER")
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(endpoint -> endpoint.baseUri("/api/v1/auth/oauth2"))
                        .redirectionEndpoint(endpoint -> endpoint.baseUri("/oauth2/callback/*"))
                        .userInfoEndpoint(endpoint -> endpoint.userService(oAuth2UserService))
                        .successHandler(oAuth2SuccessHandler))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(new FailedAuthenticationEntryPoint()))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // JWT 필터 적용
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler(logoutSuccessHandler())
                        .permitAll());

        return httpSecurity.build();
    }

    @Bean
    protected LogoutSuccessHandler logoutSuccessHandler() {
        return new SimpleUrlLogoutSuccessHandler(); // 로그아웃 후 홈 페이지로 리디렉션
    }

    @Bean
    protected CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        
        // 특정 Origin만 허용 (hyunam.site)
        corsConfiguration.addAllowedOriginPattern("https://hyunam.site");
        
        // WebSocket 요청에 대한 허용 메소드 추가 (OPTIONS, GET, POST 등)
        corsConfiguration.addAllowedMethod("GET");
        corsConfiguration.addAllowedMethod("POST");
        corsConfiguration.addAllowedMethod("OPTIONS"); // WebSocket의 경우 Preflight 요청이 발생할 수 있음
        
        // 허용할 헤더
        corsConfiguration.addAllowedHeader("Origin");
        corsConfiguration.addAllowedHeader("Content-Type");
        corsConfiguration.addAllowedHeader("Accept");
        corsConfiguration.addAllowedHeader("Authorization");
        corsConfiguration.addAllowedHeader("X-Requested-With");
        
        corsConfiguration.setAllowCredentials(true);  // 쿠키와 자격 증명을 허용
        corsConfiguration.setMaxAge(3600L);  // 1시간 동안 CORS preflight 캐시
    
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 모든 경로에 대해 CORS 설정을 적용
        source.registerCorsConfiguration("/**", corsConfiguration);
    
        return source;
    }
}

// 상단 authorizeHttpRequests에서 hasRole이나 권한에 대해서 실패가 이루어지는 경우 발행하는 코드
class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // SC_FORBIDDEN 권한없음을 나타냄
        //
        response.getWriter().write("{\"code\": \"NP\", \"message\": \"No permission.\"}");
    }

}
