package com.kugring.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kugring.back.entity.PointCharge;
import com.kugring.back.entity.User;


@Repository
public interface PointChargeRepositoy extends JpaRepository<PointCharge, Long> {

  boolean existsByPointChargeIdAndStatus(Long pointChargeId, String status);

  boolean existsByPointChargeId(Long pointChargeId);

  PointCharge findByPointChargeId(Long pointChargeId);

  PointCharge findByStatus(String stause);

  PointCharge findByUser(User user);

  PointCharge findByManagerId(int managerId);

  // User_UserId: PointCharge 엔티티에서 User 객체의 userId를 기준으로 검색
  boolean existsByUser_UserIdAndPointChargeIdAndStatus(String userId, Long pointChargeId, String status);

  // pointChargeId와 userId를 기준으로 삭제
  void deleteByPointChargeIdAndUser_UserId(Long pointChargeId, String userId);
}
