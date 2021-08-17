package com.example.PeopleNet.controller;

import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.payload.response.JwtResponse;
import com.example.PeopleNet.service.UserService;
import com.example.PeopleNet.util.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class JwtController {
    private final UserService userService;

    @GetMapping("/refresh-token")
    public JwtResponse refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        try {
            String refreshToken = JwtUtils.extractJwsFromHeader(request);
            String subject = JwtUtils.verifyTokenAndReturnClaims(refreshToken).getSubject();

            User user = (User) this.userService.loadUserByUsername(subject);
            // generate a new access token.
            String newAccessToken = JwtUtils.generateAccessToken(user);

            new ObjectMapper().writeValue(response.getOutputStream(), JwtUtils.getJwtResponse(user, newAccessToken, refreshToken));
        } catch (JwtException exception) {
            JwtUtils.processJwtException(response, exception);
        }

        return null;
    }
}
