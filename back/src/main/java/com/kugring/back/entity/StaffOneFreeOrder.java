package com.kugring.back.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "`staff_one_free_order`")
public class StaffOneFreeOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long freeOrderId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // 주문한 사용자

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order; // 주문

    @ManyToOne
    @JoinColumn(name = "order_detail_id")
    private OrderDetail orderDetail; // 해당 주문 항목

    private String status; // 주문 상태

    private LocalDateTime createdAt;

}
