package com.example.PeopleNet.controller;

import com.example.PeopleNet.domain.Message;
import com.example.PeopleNet.domain.Views;
import com.example.PeopleNet.dto.EventType;
import com.example.PeopleNet.dto.ObjectType;
import com.example.PeopleNet.repo.MessageRepo;
import com.example.PeopleNet.util.WsSender;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.BiConsumer;

@RestController
@RequestMapping("/api/message")
public class MessageController {
    private final MessageRepo messageRepo;
    private final BiConsumer<EventType, Message> wsSender;

    public MessageController(MessageRepo messageRepo, WsSender wsSender) {
        this.messageRepo = messageRepo;
        this.wsSender = wsSender.getSender(ObjectType.MESSAGE, Views.IdText.class);
    }

    @GetMapping
    @JsonView(Views.IdText.class)
    public List<Message> list() {
        return this.messageRepo.findAll();
    }

    @GetMapping("{id}")
    public Message getOne(@PathVariable("id") Message message) {
        return message;
    }

    @PostMapping
    public Message create(@RequestBody Message message) {
        message.setCreationDate(LocalDateTime.now());
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
