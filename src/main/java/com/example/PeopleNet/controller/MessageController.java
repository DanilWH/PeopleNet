package com.example.PeopleNet.controller;

import com.example.PeopleNet.domain.Message;
import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.domain.Views;
import com.example.PeopleNet.dto.MessagePageDto;
import com.example.PeopleNet.service.MessageService;
import com.example.PeopleNet.service.UserService;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
public class MessageController {
    private final MessageService messageService;
    private final UserService userService;

    @Autowired
    public MessageController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    @GetMapping()
    @JsonView(Views.FullMessage.class)
    public List<Message> list() {
        return this.messageService.findAll();
    }

    @GetMapping("page")
    @JsonView(Views.FullMessage.class)
    public MessagePageDto page(
            @PageableDefault(size = 3, sort = { "id" }, direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return this.messageService.findAll(pageable);
    }

    @GetMapping("{id}")
    public Message getOne(@PathVariable("id") Message message) {
        return message;
    }

    @PostMapping
    @JsonView(Views.FullMessage.class)
    public Message create(@RequestBody Message message) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = (User) this.userService.loadUserByUsername(username);

        return this.messageService.create(message, user);
    }

    @PutMapping("{id}")
    public Message update(
            @PathVariable("id") Message messageFromDb,
            @RequestBody Message message
    ) {
        return this.messageService.update(messageFromDb, message);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Message message) {
        this.messageService.delete(message);
    }
}
