package com.kugring.back.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kugring.back.entity.Menu;
import com.kugring.back.repository.resultSet.GetActiveMenuListResultSet;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

  // 메뉴가 존재하는지 확인해준다.
  boolean existsByMenuIdIn(List<Long> menuIds);

  Menu findByMenuId(Long menuId);

  // 1이 정상이고 -1이 비정상
  @Query("SELECT " +
        "m.category AS category, " +
        "m.menuId AS menuId, " +
        "m.name AS name, " +
        "m.price AS price, " +
        "m.image AS image, " +
        "m.sequence AS sequence, " +
        "m.temperature AS temperature " +
        "FROM Menu m " +
        "WHERE m.status = :status " +
        "ORDER BY m.category, m.sequence")
  List<GetActiveMenuListResultSet> findByStatus(@Param("status") int status);




  @Query("SELECT m.price FROM Menu m WHERE m.id = ?1")
  Optional<Long> findPriceByMenuId(Long menuId);



}
