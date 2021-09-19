package com.example.PeopleNet.domain;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

@Entity
@Table
@Data
@EqualsAndHashCode(of = { "id" })
public class Comment {
    @Id
    @GeneratedValue
    @JsonView(Views.IdText.class)
    private Long id;

    @JsonView(Views.IdText.class)
    private String text;

    @ManyToOne
    @JoinColumn(name = "message_id")
    @JsonView(Views.FullComment.class)
    private Message message; // backreference

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    @JsonView(Views.IdText.class)
    private User author;
}
