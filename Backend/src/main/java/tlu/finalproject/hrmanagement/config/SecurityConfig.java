package tlu.finalproject.hrmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Tắt CSRF nếu chỉ dùng API
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/**").permitAll()  // Cho phép truy cập API users
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}