// package com.kugring.back.repository;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import com.kugring.back.entity.StaffOneFreeOrder;
// import com.kugring.back.entity.User;

// import java.time.LocalDateTime;

// @Repository
// public interface StaffOneFreeOrderRepository extends JpaRepository<StaffOneFreeOrder, Integer> {

//     @Query("SELECT COUNT(s) > 0 FROM StaffOneFreeOrder s " +
//            "WHERE s.user = :user " +
//            "AND s.createdAt >= :startOfWeek " +
//            "AND s.createdAt < :endOfWeek")
//     boolean existsByUserAndCreatedAtBetween(
//         @Param("user") User user,
//         @Param("startOfWeek") LocalDateTime startOfWeek,
//         @Param("endOfWeek") LocalDateTime endOfWeek
//     );
// }
