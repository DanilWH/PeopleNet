package com.example.PeopleNet.config.filter;

import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.service.UserService;
import com.example.PeopleNet.util.JwtUtils;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequiredArgsConstructor
public class CustomAuthorizationFilter extends OncePerRequestFilter {
    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (!request.getRequestURI().equals("/api/login")) {
            try {
                String accessToken = JwtUtils.extractJwsFromHeader(request);
                String subject = JwtUtils.verifyTokenAndReturnClaims(accessToken).getSubject();

                User userDetails = (User) userService.loadUserByUsername(subject);
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails.getUsername(),
                        null,
                        userDetails.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                // update the user last visit time.
                userService.updateLastVisit(userDetails);
            } catch (JwtException exception) {
                JwtUtils.processJwtException(response, exception);
            }
        }
        filterChain.doFilter(request, response);
    }
}
