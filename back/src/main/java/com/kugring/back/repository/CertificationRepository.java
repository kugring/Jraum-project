package com.kugring.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kugring.back.entity.Certification;

import jakarta.transaction.Transactional;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, String> {

  Certification findByUserId(String userId);

  @Transactional
  void deleteByUserId(String userId);

}
