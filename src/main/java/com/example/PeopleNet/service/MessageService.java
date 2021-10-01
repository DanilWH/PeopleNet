package com.example.PeopleNet.service;

import com.example.PeopleNet.domain.Message;
import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.domain.Views;
import com.example.PeopleNet.dto.EventType;
import com.example.PeopleNet.dto.MessagePageDto;
import com.example.PeopleNet.dto.ObjectType;
import com.example.PeopleNet.repo.MessageRepo;
import com.example.PeopleNet.util.WsSender;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.BiConsumer;

@Service
public class MessageService {
    private final MessageRepo messageRepo;
    private final BiConsumer<EventType, Message> wsSender;

    public MessageService(MessageRepo messageRepo, WsSender wsSender) {
        this.messageRepo = messageRepo;
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
        BeanUtils.copyProperties(message, messageFromDb, "id");
        Message updatedMessage = this.messageRepo.save(messageFromDb);

        this.wsSender.accept(EventType.UPDATE, updatedMessage);

        return updatedMessage;
    }

    public void delete(Message message) {
        this.messageRepo.delete(message);
        this.wsSender.accept(EventType.REMOVE, message);
    }

    public MessagePageDto findAll(Pageable pageable) {
        Page<Message> page = this.messageRepo.findAll(pageable);

        return new MessagePageDto(
                page.getContent(),
                pageable.getPageNumber(),
                page.getTotalPages()
        );
    }

    public List<Message> findAll() {
        return this.messageRepo.findAll();
    }
}
