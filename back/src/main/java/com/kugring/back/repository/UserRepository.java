package com.kugring.back.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kugring.back.entity.User;
import com.kugring.back.repository.resultSet.GetSortedUserResultSet;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

      // 아이디 중복 체크
      boolean existsByUserId(String userId);
      // 제이라움으로 회원가입할때 사용함
      boolean existsByPin(String pin);

      boolean existsByNickname(String nickname);

      User findByPin(String pin);

      User findByUserId(String userId);

      @Query("SELECT u AS user, " +
                  "SUM(oi.quantity * m.price + COALESCE(subQuery.totalOptionPrice, 0)) AS totalSpent " +
                  "FROM User u " +
                  "LEFT JOIN u.orders o " +
                  "LEFT JOIN o.orderDetails oi " +
                  "LEFT JOIN oi.menu m " +
                  "LEFT JOIN (" +
                  "    SELECT odOpt.orderDetail.id AS orderDetailId, SUM(odOpt.quantity * mo.price) AS totalOptionPrice "
                  +
                  "    FROM OrderDetailOption odOpt " +
                  "    JOIN odOpt.menuOption mo " +
                  "    GROUP BY odOpt.orderDetail.id" +
                  ") subQuery ON subQuery.orderDetailId = oi.id " +
                  "WHERE u.type > 0 " +
                  "AND (:name IS NULL OR u.name LIKE CONCAT('%', :name, '%')) " +
                  "AND (:pin IS NULL OR u.pin LIKE CONCAT('%', :pin, '%')) " +
                  "AND u.name IS NOT NULL " +
                  "AND u.pin IS NOT NULL " +
                  "GROUP BY u.id, u.name, u.pin, u.createdAt " +
                  "ORDER BY " +
                  "CASE " +
                  "    WHEN :sort = 'name' THEN u.name " +
                  "    WHEN :sort = 'pin' THEN u.pin " +
                  "    ELSE NULL " +
                  "END ASC, " +
                  "CASE " +
                  "    WHEN :sort = 'createdAt' THEN u.createdAt " +
                  "    ELSE NULL " +
                  "END DESC, " +
                  "CASE " +
                  "    WHEN :sort = 'updatedAt' THEN u.updatedAt " +
                  "    ELSE NULL " +
                  "END DESC, " +
                  "u.name ASC")
      List<GetSortedUserResultSet> findSortedUser(
                  @Param("sort") String sort,
                  @Param("name") String name,
                  @Param("pin") String pin,
                  Pageable pageable);

}
