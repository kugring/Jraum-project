package com.kugring.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kugring.back.entity.OrderDetail;
import jakarta.transaction.Transactional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    @Transactional
    void deleteByOrderDetailId(Long orderDetailId);
}

