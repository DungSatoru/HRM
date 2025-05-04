package tlu.finalproject.hrmanagement.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.filter.CorsFilter;
import tlu.finalproject.hrmanagement.exception.CustomAuthenticationEntryPoint;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsFilter corsFilter;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomAuthenticationEntryPoint customAuthEntryPoint;

    private final String[] PUBLIC_ENDPOINT = {
            "/api/auth/login",  // Chỉ login là không cần token
            "/api/auth/token",  // Cấp token
            "/api/auth/introspect"  // Các endpoint public khác nếu cần
    };

    // Cung cấp AuthenticationManager Bean
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder);
        return authenticationManagerBuilder.build();
    }

    // Cấu hình SecurityFilterChain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Disable CSRF
                .addFilterBefore(corsFilter, CorsFilter.class)  // Thêm CORS filter
                .authorizeRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINT).permitAll()  // Cho phép truy cập vào login, token
                        .requestMatchers("/api/attendance/**").hasAnyRole("ADMIN", "HR", "MANAGER") // Phân quyền cho chấm công

                        .requestMatchers("/api/departments/**").hasRole("ADMIN") // Phân quyền cho quản lý roles, departments và positions

                        .requestMatchers(HttpMethod.GET, "/api/positions/**", "/api/roles/**").hasAnyRole("EMPLOYEE", "ADMIN", "MANAGER", "ACCOUNTANT", "HR")
                        .requestMatchers("/api/positions/**", "/api/roles/**").hasRole("ADMIN")

                        .requestMatchers("/api/salary-bonuses/**", "/api/salary-config/**").hasAnyRole("ADMIN", "HR", "MANAGER") // Phân quyền cho lương và thưởng
                        .requestMatchers(HttpMethod.GET, "/api/salaries/employee/**").hasAnyRole("EMPLOYEE", "ADMIN", "MANAGER", "ACCOUNTANT", "HR")
                        .requestMatchers("/api/salaries/**").hasAnyRole("ADMIN", "ACCOUNTANT", "HR") .requestMatchers("/api/users/**").hasAnyRole("ADMIN", "HR", "MANAGER") // Quản lý người dùng

                        .requestMatchers("/api/video/upload").hasRole("ADMIN") // Phân quyền cho video upload

                        .anyRequest().authenticated()  // Các request khác yêu cầu có token hợp lệ
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.decoder(jwtTokenProvider.jwtDecoder()))  // Sử dụng JwtDecoder để giải mã token
                        .authenticationEntryPoint(customAuthEntryPoint) // Gắn xử lý lỗi ở đây
                )
                .httpBasic().disable();  // Tắt basic auth nếu không cần thiết

        return http.build();
    }

    // Bỏ qua Spring Security cho WebSocket
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers(new AntPathRequestMatcher("/ws/**"));
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix(""); // KHÔNG thêm "ROLE_", vì đã có sẵn trong DB/token
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles"); // Đọc từ claim "roles"

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}
