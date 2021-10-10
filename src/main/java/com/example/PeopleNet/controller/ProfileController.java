package com.example.PeopleNet.controller;

import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.domain.Views;
import com.example.PeopleNet.service.ProfileService;
import com.example.PeopleNet.service.UserService;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserService userService;
    private final ProfileService profileService;

    @GetMapping("{id}")
    @JsonView(Views.FullProfile.class)
    public User get(
            @AuthenticationPrincipal User currentUser,
            @PathVariable("id") User user
    ) {
        // hide the email if the current user is viewing someone else's profile.
        if (!user.equals(currentUser)) {
            user.setEmail(null); // TODO change the approach of hiding email for strangers and remove this line.
        }

        return user;
    }

    @PostMapping("change-subscription/{channelId}")
    @JsonView(Views.FullProfile.class)
    public User changeSubscription(
            @AuthenticationPrincipal User subscriber,
            @PathVariable("channelId") User channel
    ) {
        // if the current user is trying to subscribe to himself.
        if (subscriber.equals(channel)) {
            return channel;
        } else {
            User userFromDb = this.profileService.changeSubscription(subscriber, channel);
            userFromDb.setEmail(null); // TODO change the approach of hiding email for strangers and remove this line.
            return userFromDb;
        }
    }
}
