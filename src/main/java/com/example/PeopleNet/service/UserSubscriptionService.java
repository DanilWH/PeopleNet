package com.example.PeopleNet.service;

import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.domain.UserSubscription;
import com.example.PeopleNet.repo.UserSubscriptionRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserSubscriptionService {
    private final UserSubscriptionRepo userSubscriptionRepo;

    public UserSubscriptionService(UserSubscriptionRepo userSubscriptionRepo) {
        this.userSubscriptionRepo = userSubscriptionRepo;
    }


    public List<UserSubscription> getSubscribers(User channel) {
        return this.userSubscriptionRepo.findByChannel(channel);
    }

    public UserSubscription changeSubscriptionStatus(User subscriber, User channel) {
        UserSubscription subscription = this.userSubscriptionRepo.findBySubscriberAndChannel(subscriber, channel);
        subscription.setActive(!subscription.isActive());

        return this.userSubscriptionRepo.save(subscription);
    }
}
