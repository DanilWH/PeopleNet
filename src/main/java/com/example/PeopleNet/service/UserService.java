package com.example.PeopleNet.service;

import com.example.PeopleNet.domain.RoleType;
import com.example.PeopleNet.domain.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    UserDetails loadUserByUsername(String username);
    User register(User user);
    void addRoleToUser(RoleType roleType, String username);
    void updateLastVisit(User user);
}
