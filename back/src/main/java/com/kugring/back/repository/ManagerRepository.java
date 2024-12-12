package com.kugring.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.kugring.back.entity.Manager;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Integer> {

  boolean existsByManagerId(String managerId);

  boolean existsByPin(String pin);

  @Query(value = "SELECT manager_id FROM manager WHERE pin = ?1 AND password = ?2", nativeQuery = true)
  Integer findIdByManagerPinAndManagerPassword(String managerPin, String managerPassword);

  Manager findByPin(String pin);

}
