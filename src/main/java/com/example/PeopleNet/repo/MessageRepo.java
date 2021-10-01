package com.example.PeopleNet.repo;

import com.example.PeopleNet.domain.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {
    @EntityGraph(attributePaths = { "comments" })
    Page<Message> findAll(Pageable pageable);
}
