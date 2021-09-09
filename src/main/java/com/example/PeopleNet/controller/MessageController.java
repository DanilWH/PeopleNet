package com.example.PeopleNet.controller;

import com.example.PeopleNet.domain.Message;
import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.domain.Views;
import com.example.PeopleNet.dto.EventType;
import com.example.PeopleNet.dto.ObjectType;
import com.example.PeopleNet.repo.MessageRepo;
import com.example.PeopleNet.service.UserService;
import com.example.PeopleNet.util.WsSender;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.BiConsumer;

@RestController
@RequestMapping("/api/message")
public class MessageController {
    private final MessageRepo messageRepo;
    private final BiConsumer<EventType, Message> wsSender;
    private final UserService userService;

    public MessageController(MessageRepo messageRepo, WsSender wsSender, UserService userService) {
        this.messageRepo = messageRepo;
        this.wsSender = wsSender.getSender(ObjectType.MESSAGE, Views.IdText.class);
        this.userService = userService;
    }

    @GetMapping
    @JsonView(Views.FullMessage.class)
    public List<Message> list() {
        return this.messageRepo.findAll();
    }

    @GetMapping("{id}")
    public Message getOne(@PathVariable("id") Message message) {
        return message;
    }

    @PostMapping
    public Message create(@RequestBody Message message) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = (User) this.userService.loadUserByUsername(username);

        message.setCreationDate(LocalDateTime.now());
        message.setAuthor(user);

        Message savedMessage = this.messageRepo.save(message);

        this.wsSender.accept(EventType.CREATE, savedMessage);

        return savedMessage;
    }

    @PutMapping("{id}")
    public Message update(
            @PathVariable("id") Message messageFromDb,
            @RequestBody Message message
    ) {
        BeanUtils.copyProperties(message, messageFromDb, "id");
        Message updatedMessage = this.messageRepo.save(messageFromDb);

        this.wsSender.accept(EventType.UPDATE, updatedMessage);

        return updatedMessage;
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Message message) {
        this.messageRepo.delete(message);
        this.wsSender.accept(EventType.REMOVE, message);
    }
}
