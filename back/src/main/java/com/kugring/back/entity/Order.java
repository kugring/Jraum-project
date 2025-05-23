package com.kugring.back.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.kugring.back.dto.request.order.PostPointOrderRequestDto;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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
@Table(name = "`order`")
public class Order {


  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long orderId;



  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user; // 주문한 사용자

  private String status; // 주문 상태
  private String payMethod; // 결제 방법

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private List<OrderDetail> orderDetails; // 주문 항목들


  public Order(PostPointOrderRequestDto dto, User user) {
    this.user = user;
    this.createdAt = LocalDateTime.now();
    this.status = "대기";
  }


    // 엔티티가 저장되기 전에 호출되어 createdAt을 설정
  @PrePersist
  public void prePersist() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  // 엔티티가 업데이트되기 전에 호출되어 updatedAt을 설정
  @PreUpdate
  public void preUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

}

