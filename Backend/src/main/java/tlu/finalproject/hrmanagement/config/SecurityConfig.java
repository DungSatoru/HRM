package tlu.finalproject.hrmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final CorsFilter corsFilter;

    public SecurityConfig(CorsFilter corsFilter) {
        this.corsFilter = corsFilter;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()  // Tắt CSRF nếu chỉ dùng API
                .addFilterBefore(corsFilter, CorsFilter.class)  // Thêm CorsFilter vào chuỗi lọc bảo mật
                .authorizeRequests()
                .requestMatchers("/api/users/**").permitAll()  // Sử dụng requestMatchers thay cho antMatchers
                .anyRequest().permitAll()  // Cho phép tất cả các yêu cầu khác mà không cần xác thực
                .and()
                .httpBasic().disable();  // Tắt Basic Authentication

        return http.build();
    }
}