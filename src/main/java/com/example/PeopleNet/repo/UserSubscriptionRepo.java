package com.example.PeopleNet.repo;

import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.domain.UserSubscription;
import com.example.PeopleNet.domain.UserSubscriptionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSubscriptionRepo extends JpaRepository<UserSubscription, UserSubscriptionId> {
    List<UserSubscription> findBySubscriber(User subscriber);

    List<UserSubscription> findByChannel(User channel);

    UserSubscription findBySubscriberAndChannel(User subscriber, User channel);
}
