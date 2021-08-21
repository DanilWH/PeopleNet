package com.example.PeopleNet.controller;

import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.payload.response.JwtResponse;
import com.example.PeopleNet.service.UserService;
import com.example.PeopleNet.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class JwtController {
    private final UserService userService;

    @GetMapping("/refresh-token")
    public JwtResponse refreshToken(
            HttpServletRequest request
    ) throws IOException {
        // get the user that requested the refreshing token.
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = (User) this.userService.loadUserByUsername(username);

        // generate a new access token for the user.
        String newAccessToken = JwtUtils.generateAccessToken(user);
        // extract the refresh token.
        String refreshToken = JwtUtils.extractJwsFromHeader(request);

        return JwtUtils.getJwtResponse(user, newAccessToken, refreshToken);
    }
}
