package com.example.PeopleNet.repo;

import com.example.PeopleNet.domain.Message;
import com.example.PeopleNet.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {
    @EntityGraph(attributePaths = { "comments" })
    Page<Message> findByAuthorIn(List<User> channels, Pageable pageable);
}
