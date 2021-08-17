package com.example.PeopleNet.util;

import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.payload.response.FailedJwsResponse;
import com.example.PeopleNet.payload.response.JwtResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Key;
import java.util.Date;

public final class JwtUtils {
    private static final Key JWT_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long ACCESS_TOKEN_EXPIRATION_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days.
    private static final long REFRESH_TOKEN_EXPIRATION_DURATION = 1000L * 60 * 60 * 24 * 30; // 30 days.

    public static Key getJwtKey() {
        return JWT_KEY;
    }

    public static String generateAccessToken(User userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION_DURATION))
                .signWith(JWT_KEY)
                .compact();
    }

    public static String generateRefreshToken(User userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_DURATION))
                .signWith(JWT_KEY)
                .compact();
    }

    public static Claims verifyTokenAndReturnClaims(String jws) {
        return Jwts.parserBuilder()
                .setSigningKey(JwtUtils.getJwtKey())
                .build()
                .parseClaimsJws(jws)
                .getBody();
    }

    public static String extractJwsFromHeader(HttpServletRequest request) {
        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring("Bearer ".length());
        }

        throw new RuntimeException("The Authorization header isn't present or Bearer is missing");
    }

    public static JwtResponse getJwtResponse(User user, String accessToken, String refreshToken) {
        return new JwtResponse()
                .setId(user.getId())
                .setUsername(user.getUsername())
                .setAvatar(user.getAvatar())
                .setEmail(user.getEmail())
                .setGender(user.getGender())
                .setLastVisit(System.currentTimeMillis())
                .setRoles(user.getRoles())
                .setAccessToken(accessToken)
                .setRefreshToken(refreshToken)
                .setAccessTokenExpiration(verifyTokenAndReturnClaims(accessToken).getExpiration().getTime())
                .setRefreshTokenExpiration(verifyTokenAndReturnClaims(refreshToken).getExpiration().getTime());
    }

    public static void processJwtException(HttpServletResponse response, JwtException exception) throws IOException {
        response.setHeader("error", exception.getMessage());
        response.setStatus(HttpStatus.UNAUTHORIZED.value());

        new ObjectMapper().writeValue(response.getOutputStream(), new FailedJwsResponse(exception.getMessage()));

        throw new RuntimeException(exception.getMessage());
    }
}
