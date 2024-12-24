package com.kugring.back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kugring.back.entity.MenuOption;
import com.kugring.back.repository.resultSet.GetMenuOptionListResultSet;

@Repository
public interface OptionRepository extends JpaRepository<MenuOption, Long> {

  // 옵션 id가 존재하는지 확인해줌
  boolean existsByOptionIdIn(List<Long> menuIds);

  MenuOption findByOptionId(Long optionId);

  // 옵션의 가격만 가져오는 함수
  @Query("SELECT o.price FROM MenuOption o WHERE o.optionId = :optionId")
  List<Integer> findPriceByOptionId(@Param("optionId") Long optionId);

  // 나중에 옵션 생성시 이름 중복확인을 위한것
  boolean existsByDetail(String detail);

  // menu_id로 menu를 조회한 후, 해당 menu의 option_id들을 가져오고, 그 option들에 대한 정보를 조회하는 쿼리
  @Query("SELECT o.optionId AS optionId, o.price AS price, o.category AS category, o.status AS status, o.detail AS detail, o.sequence AS sequence, o.type AS type FROM Menu m JOIN m.options o WHERE m.menuId = :menuId AND o.status = 1 ORDER BY o.sequence ASC")
  List<GetMenuOptionListResultSet> findByMenuId(@Param("menuId") Long menuId);

  // 메뉴 생성할때 카테고리로 데이터를 가져오는 함수
  @Query("SELECT o FROM MenuOption o WHERE o.category = :category")
  List<MenuOption> findByCategory(@Param("category") String category);
  // 메뉴 생성할때 카테고리로 데이터를 가져오는 함수
  @Query("SELECT o FROM MenuOption o WHERE o.detail = :detail")
  List<MenuOption> findByDetail(@Param("detail") String detail);
}
