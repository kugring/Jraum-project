package com.kugring.back.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.kugring.back.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    // userId, orderStatus, createDate, completeDate 동적 필터링
    @Query("SELECT o FROM Order o " +
            "WHERE (:userId IS NULL OR o.user.userId = :userId) " +
            "AND (:status IS NULL OR o.status = :status) " +
            "AND (:startCreateDate IS NULL OR o.createdAt >= :startCreateDate) " +
            "AND (:endCreateDate IS NULL OR o.createdAt <= :endCreateDate) " +
            "AND (:startCompleteDate IS NULL OR o.updatedAt >= :startCompleteDate) " +
            "AND (:endCompleteDate IS NULL OR o.updatedAt <= :endCompleteDate)")
    List<Order> findOrders(@Param("userId") String userId,
            @Param("status") String status,
            @Param("startCreateDate") LocalDateTime startCreateDate,
            @Param("endCreateDate") LocalDateTime endCreateDate,
            @Param("startCompleteDate") LocalDateTime startCompleteDate,
            @Param("endCompleteDate") LocalDateTime endCompleteDate);

    // 주문 ID로 데이터 찾기
    @Query("SELECT ol FROM Order ol "
            + "JOIN FETCH ol.orderDetails oi "
            + "JOIN FETCH oi.menu "
            + "WHERE ol.orderId = :orderId")
    Order findByOrderId(@Param("orderId") Long orderId);

    // 주문 상태에 따린 count값 가져오는 함수
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") String status);


    // status가 '미승인'이면서 payMethod가 '현금결제'인 주문에 해당하는 사용자 이름 목록 반환
    @Query("SELECT o.user.name FROM Order o " +
            "WHERE o.status = '미승인' " +
            "AND o.payMethod = '현금결제'")
    String[] findUserNamesByUnapprovedAndCashPayment();

}
