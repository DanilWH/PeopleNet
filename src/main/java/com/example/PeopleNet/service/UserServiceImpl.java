package com.example.PeopleNet.service;

import com.example.PeopleNet.domain.RoleType;
import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
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

    @Override
    public User register(User user) {
        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        return this.userRepo.save(user);
    }

    @Override
    public void addRoleToUser(RoleType roleType, String username) {
        User user = this.userRepo.findByUsername(username);
        user.getRoles().add(roleType);
    }

    @Override
    public void updateLastVisit(User user) {
        user.setLastVisit(LocalDateTime.now());
        this.userRepo.save(user);
    }
}