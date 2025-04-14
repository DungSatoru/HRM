package tlu.finalproject.hrmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowedOrigins(List.of(("http://localhost:3000"))); // Cho phép tất cả nguồn gốc
        config.setAllowedOrigins(List.of("*")); // Cho phép tất cả nguồn gốc
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
        config.setAllowedHeaders(List.of("*"));
//        config.setAllowCredentials(true); // Cho phép credentials (cookies, tokens)
        config.setAllowCredentials(false); // Cho phép credentials (cookies, tokens)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
