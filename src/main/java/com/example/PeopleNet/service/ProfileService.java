package com.example.PeopleNet.service;

import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.domain.UserSubscription;
import com.example.PeopleNet.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserRepo userRepo;

    public User changeSubscription(User subscriber, User channel) {
        List<UserSubscription> channelSubscribers = channel.getSubscribers()
                .stream()
                .filter(userSubscription -> userSubscription.getSubscriber().equals(subscriber))
                .collect(Collectors.toList());

        // if the subscriber isn't subscribed to the channel (user).
        if (channelSubscribers.isEmpty()) {
            UserSubscription newSubscription = new UserSubscription(subscriber, channel);
            channel.getSubscribers().add(newSubscription);
        } else {
            channel.getSubscribers().removeAll(channelSubscribers);
        }

        return this.userRepo.save(channel);
    }
}
