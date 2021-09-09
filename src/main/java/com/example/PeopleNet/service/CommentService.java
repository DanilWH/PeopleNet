package com.example.PeopleNet.service;

import com.example.PeopleNet.domain.Comment;
import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.repo.CommentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepo commentRepo;

    public Comment create(Comment comment, User user) {
        comment.setAuthor(user);
        this.commentRepo.save(comment);

        return comment;
    }
}
