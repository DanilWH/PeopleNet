package com.example.PeopleNet.payload.response;

import com.example.PeopleNet.domain.RoleType;
import lombok.Getter;

import java.util.Set;

@Getter
public class JwtResponse {
    private Long id;
    private String username;
    private String avatar;
    private String email;
    private String gender;
    private long lastVisit;
    private Set<RoleType> roles;
    private String accessToken;
    private String refreshToken;
    private long accessTokenExpiration;
    private long refreshTokenExpiration;

    public JwtResponse setId(Long id) {
        this.id = id;
        return this;
    }

    public JwtResponse setUsername(String username) {
        this.username = username;
        return this;
    }

    public JwtResponse setAvatar(String avatar) {
        this.avatar = avatar;
        return this;
    }

    public JwtResponse setEmail(String email) {
        this.email = email;
        return this;
    }

    public JwtResponse setGender(String gender) {
        this.gender = gender;
        return this;
    }

    public JwtResponse setLastVisit(long lastVisit) {
        this.lastVisit = lastVisit;
        return this;
    }

    public JwtResponse setRoles(Set<RoleType> roles) {
        this.roles = roles;
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
