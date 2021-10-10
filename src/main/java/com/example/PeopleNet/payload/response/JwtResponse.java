package com.example.PeopleNet.payload.response;

import lombok.Getter;

@Getter
public class JwtResponse {
    private Long id;
    private String accessToken;
    private String refreshToken;
    private long accessTokenExpiration;
    private long refreshTokenExpiration;

    public JwtResponse setId(Long id) {
        this.id = id;
        return this;
    }

    public JwtResponse setAccessToken(String accessToken) {
        this.accessToken = accessToken;
        return this;
    }

    public JwtResponse setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
        return this;
    }

    public JwtResponse setAccessTokenExpiration(long accessTokenExpiration) {
        this.accessTokenExpiration = accessTokenExpiration;
        return this;
    }

    public JwtResponse setRefreshTokenExpiration(long refreshTokenExpiration) {
        this.refreshTokenExpiration = refreshTokenExpiration;
        return this;
    }
}
