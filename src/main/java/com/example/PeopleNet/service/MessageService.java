package com.example.PeopleNet.service;

import com.example.PeopleNet.domain.Message;
import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.domain.UserSubscription;
import com.example.PeopleNet.domain.Views;
import com.example.PeopleNet.dto.EventType;
import com.example.PeopleNet.dto.MessagePageDto;
import com.example.PeopleNet.dto.ObjectType;
import com.example.PeopleNet.repo.MessageRepo;
import com.example.PeopleNet.repo.UserSubscriptionRepo;
import com.example.PeopleNet.util.WsSender;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final MessageRepo messageRepo;
    private final UserSubscriptionRepo userSubscriptionRepo;
    private final BiConsumer<EventType, Message> wsSender;

    public MessageService(MessageRepo messageRepo, UserSubscriptionRepo userSubscriptionRepo, WsSender wsSender) {
        this.messageRepo = messageRepo;
        this.userSubscriptionRepo = userSubscriptionRepo;
        this.wsSender = wsSender.getSender(ObjectType.MESSAGE, Views.FullMessage.class);
    }

    public Message create(Message message, User user) {
        message.setCreationDate(LocalDateTime.now());
        message.setAuthor(user);

        Message savedMessage = this.messageRepo.save(message);

        this.wsSender.accept(EventType.CREATE, savedMessage);

        return savedMessage;
    }

    public Message update(Message messageFromDb, Message message) {
        messageFromDb.setText(message.getText());
        Message updatedMessage = this.messageRepo.save(messageFromDb);

        this.wsSender.accept(EventType.UPDATE, updatedMessage);

        return updatedMessage;
    }

    public void delete(Message message) {
        this.messageRepo.delete(message);
        this.wsSender.accept(EventType.REMOVE, message);
    }

    public MessagePageDto findForCurrentUser(Pageable pageable, User currentUser) {
        // we could get the current user's subscription this way:
        // `currentUser.getSubscriptions();`
        // but, because the currentUser is taken from the session, the current user's data may be old and irrelevant.
        // it is better to retrieve the current user's subscriptions out of the database.

        // find the subscriptions of the current user.
        List<User> channels = this.userSubscriptionRepo.findBySubscriber(currentUser)
                .stream()
                .filter(UserSubscription::isActive)
                .map(UserSubscription::getChannel)
                .collect(Collectors.toList());

        // add the current user itself into the list (because we want to show his posts as well).
        channels.add(currentUser);

        // find all the messages by the authors that are collected in the 'channels' list.
        Page<Message> page = this.messageRepo.findByAuthorIn(channels, pageable);

        return new MessagePageDto(
                page.getContent(),
                pageable.getPageNumber(),
                page.getTotalPages()
        );
    }
}
