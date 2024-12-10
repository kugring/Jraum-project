package com.kugring.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kugring.back.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  User findByPin(String pin);

  User findByUserId(String userId);

}
