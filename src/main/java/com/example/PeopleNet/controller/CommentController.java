package com.example.PeopleNet.controller;

import com.example.PeopleNet.domain.Comment;
import com.example.PeopleNet.domain.User;
import com.example.PeopleNet.domain.Views;
import com.example.PeopleNet.service.CommentService;
import com.example.PeopleNet.service.UserService;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {
    public final CommentService commentService;
    public final UserService userService;

    @PostMapping
    @JsonView(Views.FullComment.class)
    public Comment create(
            @AuthenticationPrincipal User user,
            @RequestBody Comment comment
    ) {
        return this.commentService.create(comment, user);
    }
}
