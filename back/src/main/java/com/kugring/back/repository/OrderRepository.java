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
        // "LEFT JOIN FETCH o.orderItems oi " + 이런거 조인 안해도 알아서 가져옴
        // "LEFT JOIN FETCH oi.orderItemOptions oio " +
        // "LEFT JOIN FETCH oi.menu m " +
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




  @Query("SELECT ol FROM Order ol " + "JOIN FETCH ol.orderDetails oi " + "JOIN FETCH oi.menu " + "WHERE ol.orderId = :orderId")
  Order findByOrderId(@Param("orderId") Long orderId);


}