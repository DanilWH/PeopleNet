package com.example.PeopleNet.service;

import com.example.PeopleNet.domain.Comment;
import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.domain.Views;
import com.example.PeopleNet.dto.EventType;
import com.example.PeopleNet.dto.ObjectType;
import com.example.PeopleNet.repo.CommentRepo;
import com.example.PeopleNet.util.WsSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.function.BiConsumer;

@Service
public class CommentService {
    private final CommentRepo commentRepo;
    private final BiConsumer<EventType, Comment> wsSender;

    @Autowired
    public CommentService(CommentRepo commentRepo, WsSender wsSender) {
        this.commentRepo = commentRepo;
        this.wsSender = wsSender.getSender(ObjectType.COMMENT, Views.FullComment.class);
    }

    public Comment create(Comment comment, User user) {
        comment.setAuthor(user);
        Comment savedComment = this.commentRepo.save(comment);

        this.wsSender.accept(EventType.CREATE, savedComment);

        return savedComment;
    }
}
