package com.example.PeopleNet.service;

import com.example.PeopleNet.domain.RoleType;
import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userRepo.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User " + username + " not found.");
        }

        return this.userRepo.findByUsername(username);
    }

    public User register(User user) {
        // first, we check if the user with such a username already exists.
        User savedUser = this.userRepo.findByUsername(user.getUsername());

        if (savedUser != null) {
            return null;
        }

        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        user.setRoles(Collections.singleton(RoleType.USER));
        return this.userRepo.save(user);
    }

    public void addRoleToUser(RoleType roleType, String username) {
        User user = this.userRepo.findByUsername(username);
        user.getRoles().add(roleType);
    }

    public void updateLastVisit(User user) {
        user.setLastVisit(LocalDateTime.now());
        this.userRepo.save(user);
    }
}
