package com.example.PeopleNet.service;

import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserRepo userRepo;

    public User changeSubscription(User subscriber, User channel) {
        Set<User> channelSubscribers = channel.getSubscribers();

        // if the subscriber is already subscribed to the channel (user).
        if (channelSubscribers.contains(subscriber)) {
            channelSubscribers.remove(subscriber);
        } else {
            channelSubscribers.add(subscriber);
        }

        return this.userRepo.save(channel);
    }
}
