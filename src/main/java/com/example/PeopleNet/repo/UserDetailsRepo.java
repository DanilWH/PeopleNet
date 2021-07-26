package com.example.PeopleNet.repo;

import com.example.PeopleNet.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailsRepo extends JpaRepository<User, String> {
}
