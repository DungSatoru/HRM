package tlu.finalproject.hrmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class SecurityConfig {

    private final CorsFilter corsFilter;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    private final String[] PUBLIC_ENDPOINT = {
            "/api/auth/login",  // Chỉ login là không cần token
            "/api/auth/token",  // Cấp token
            "/api/auth/introspect"  // Các endpoint public khác nếu cần
    };

    public SecurityConfig(CorsFilter corsFilter, UserDetailsService userDetailsService, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.corsFilter = corsFilter;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

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
                        .anyRequest().authenticated()  // Các request khác yêu cầu có token hợp lệ
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.decoder(jwtTokenProvider.jwtDecoder()))  // Sử dụng JwtDecoder để giải mã token
                )
                .httpBasic().disable();  // Tắt basic auth nếu không cần thiết

        return http.build();
    }
}
