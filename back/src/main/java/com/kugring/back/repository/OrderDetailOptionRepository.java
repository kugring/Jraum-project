package com.kugring.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kugring.back.entity.OrderDetailOption;
import jakarta.transaction.Transactional;

@Repository
public interface OrderDetailOptionRepository extends JpaRepository<OrderDetailOption, Long> {

    @Transactional
    void deleteById(@SuppressWarnings("null") Long orderItemOptionId);

}
