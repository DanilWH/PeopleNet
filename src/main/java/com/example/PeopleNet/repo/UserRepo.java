package com.example.PeopleNet.repo;

import com.example.PeopleNet.domain.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    User findByUsername(String username);

    @EntityGraph(attributePaths = { "subscriptions", "subscribers" })
    Optional<User> findById(Long aLong);

}
