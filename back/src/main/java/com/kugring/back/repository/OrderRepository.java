package com.kugring.back.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.kugring.back.entity.Order;
import com.kugring.back.repository.resultSet.GetOrderListResultSet;
import com.kugring.back.repository.resultSet.GetOrderManageMentResultSet;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

        Order findByOrderId(Long orderId);

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

        // 주문 상태에 따린 count값 가져오는 함수
        @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
        long countByStatus(@Param("status") String status);

        // status가 '대기'이면서 payMethod가 '현금결제'인 주문에 해당하는 사용자 이름 목록 반환
        @Query("SELECT o.user.name FROM Order o " +
                        "WHERE o.status = '대기' " +
                        "AND o.payMethod = '현금결제'")
        String[] findUserNamesByUnapprovedAndCashPayment();

        @Query("SELECT " +
                        "o as order, " +
                        "o.orderId as orderId, " +
                        "o.user.name as name, " +
                        "o.user.profileImage as profileImage, " +
                        "o.user.position as position, " +
                        "o.user.division as division, " +
                        "SUM(oi.quantity) as totalQuantity, " +
                        "SUM(CASE WHEN m.temperature = 'HOT' THEN oi.quantity ELSE 0 END) as hotCount, " +
                        "SUM(CASE WHEN m.temperature = 'COLD' THEN oi.quantity ELSE 0 END) as coldCount " +
                        "FROM Order o " +
                        "JOIN o.orderDetails oi " +
                        "JOIN oi.menu m " +
                        "WHERE o.status = :status " +
                        "GROUP BY o.user.name, o.user.position, o.user.division, o.orderId")
        List<GetOrderManageMentResultSet> findOrderDetailsWithTemperatureCount(@Param("status") String status);

        @Query("SELECT " +
                        "o as order, " +
                        "o.orderId as orderId, " +
                        "o.user.name as name, " +
                        "o.user.profileImage as profileImage, " +
                        "o.user.position as position, " +
                        "o.user.division as division, " +
                        "SUM(oi.quantity) as totalQuantity, " +
                        "SUM(CASE WHEN m.temperature = 'HOT' THEN oi.quantity ELSE 0 END) as hotCount, " +
                        "SUM(CASE WHEN m.temperature = 'COLD' THEN oi.quantity ELSE 0 END) as coldCount " +
                        "FROM Order o " +
                        "JOIN o.orderDetails oi " +
                        "JOIN oi.menu m " +
                        "WHERE o.status = '대기' AND o.orderId = :orderId " +
                        "GROUP BY o.orderId, o.user.name, o.user.position, o.user.division")
        GetOrderManageMentResultSet findOrderDetailsByOrderId(@Param("orderId") Long orderId);

        @Query("SELECT " +
                        "o as order, " +
                        "o.orderId as orderId, " +
                        "o.user.name as name, " +
                        "o.user.point as point, " +
                        "o.status as status, " +
                        "o.user.division as division, " +
                        "o.user.position as position, " +
                        "o.payMethod as payMethod, " +
                        "o.createdAt as createdAt, " +
                        "o.updatedAt as updatedAt, " +
                        "o.user.profileImage as profileImage, " +
                        "SUM(oi.quantity) as totalQuantity, " +
                        "SUM(oi.quantity * m.price + " +
                        "    COALESCE((SELECT SUM(odOpt.quantity * mo.price) " +
                        "              FROM OrderDetailOption odOpt " +
                        "              JOIN odOpt.menuOption mo " +
                        "              WHERE odOpt.orderDetail = oi " +
                        "              GROUP BY odOpt.orderDetail), 0)) as totalPrice " +
                        "FROM Order o " +
                        "JOIN o.orderDetails oi " +
                        "JOIN oi.menu m " +
                        "WHERE (:name IS NULL OR " +
                        "       TRIM(REPLACE(o.user.name, ' ', '')) LIKE CONCAT('%', TRIM(REPLACE(:name, ' ', '')), '%')) "
                        +
                        "AND (:status IS NULL OR o.status = :status) " +
                        "AND (:pin IS NULL OR o.user.pin LIKE CONCAT('%', :pin, '%')) " +
                        "AND (:startOfDay IS NULL OR " +
                        "     (o.createdAt >= :startOfDay AND o.createdAt <= :endOfDay)) " +
                        "GROUP BY o.orderId, o.user.name, o.status, o.user.division, o.user.position, " +
                        "         o.payMethod, o.createdAt, o.updatedAt, o.user.profileImage " +
                        "ORDER BY o.createdAt DESC")
        List<GetOrderListResultSet> findOrderList(
                        @Param("pin") String pin,
                        @Param("name") String name,
                        @Param("status") String status,
                        @Param("startOfDay") LocalDateTime startOfDay,
                        @Param("endOfDay") LocalDateTime endOfDay,
                        Pageable pageable);

        @Query("SELECT SUM(oi.quantity * m.price + " +
                        "    COALESCE((SELECT SUM(odOpt.quantity * mo.price) " +
                        "              FROM OrderDetailOption odOpt " +
                        "              JOIN odOpt.menuOption mo " +
                        "              WHERE odOpt.orderDetail = oi), 0)) " +
                        "FROM Order o " +
                        "JOIN o.orderDetails oi " +
                        "JOIN oi.menu m " +
                        "WHERE o.orderId = :orderId")
        int findTotalPriceByOrderId(@Param("orderId") Long orderId);
}
