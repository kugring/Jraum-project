package com.kugring.back.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kugring.back.entity.PointCharge;
import com.kugring.back.entity.User;

@Repository
public interface PointChargeRepositoy extends JpaRepository<PointCharge, Long> {

        boolean existsByPointChargeIdAndStatus(Long pointChargeId, String status);

        boolean existsByPointChargeId(Long pointChargeId);

        PointCharge findByPointChargeId(Long pointChargeId);

        List<PointCharge> findByStatus(String stause);

        PointCharge findByUser(User user);

        PointCharge findByManagerId(int managerId);

        // 사용자 ID로 첫 번째 PointCharge의 status와 pointChargeId 가져오기
        PointCharge findFirstByUser_UserIdOrderByCreatedAtDesc(String userId);



        // pointChargeId와 userId를 기준으로 삭제
        void deleteByPointChargeIdAndUser_UserId(Long pointChargeId, String userId);

        // 포인트 충전 내역 출력할때 사용함함
        @Query("SELECT pc FROM PointCharge pc WHERE "
                        + "(:name IS NULL OR pc.user.name LIKE %:name%) AND "
                        + "(:status IS NULL OR pc.status = :status) AND "
                        + "(:startOfDay IS NULL OR pc.createdAt >= :startOfDay) AND "
                        + "(:endOfDay IS NULL OR pc.createdAt <= :endOfDay)")
        List<PointCharge> findChargeList(
                        @Param("name") String name,
                        @Param("status") String status,
                        @Param("startOfDay") LocalDateTime startOfDay,
                        @Param("endOfDay") LocalDateTime endOfDay,
                        Pageable pageable);
}
