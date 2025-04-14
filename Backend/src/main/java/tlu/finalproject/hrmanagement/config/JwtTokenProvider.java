package tlu.finalproject.hrmanagement.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Khóa bí mật

    private final long validityInMilliseconds = 3600000; // 1 giờ

    // Phương thức tạo token
    public String generateToken(String username, String role) {
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("role", role); // thêm role vào claims

        Date now = new Date();
        Date expiry = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(secretKey)
                .compact();
    }

    // Phương thức xác thực token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Phương thức lấy username từ token
    public String getUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRole(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    // Phương thức lấy secretKey
    public Key getSecretKey() {
        return secretKey;
    }

    // Cung cấp JwtDecoder Bean để giải mã token JWT
    @Bean
    public JwtDecoder jwtDecoder() {
        return token -> {
            try {
                // Sử dụng khóa bí mật từ JwtTokenProvider để giải mã token
                Jws<Claims> claimsJws = Jwts.parserBuilder()
                        .setSigningKey(secretKey)
                        .build()
                        .parseClaimsJws(token); // Giải mã token JWT

                Claims claims = claimsJws.getBody();
                // Trả về đối tượng Jwt, thay vì Claims
                return new Jwt(token, claims.getIssuedAt().toInstant(), claims.getExpiration().toInstant(), claims, claims);
            } catch (JwtException e) {
                throw new JwtException("Invalid JWT token", e);
            }
        };
    }

    public long getExpirationTime() {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + validityInMilliseconds);
        return (expiry.getTime() - now.getTime()) / 1000; // Trả về thời gian còn lại tính bằng giây
    }
}
