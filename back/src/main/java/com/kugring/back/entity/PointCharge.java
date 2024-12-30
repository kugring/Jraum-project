package com.kugring.back.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "`point_charge`")
public class PointCharge {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long pointChargeId;

  @NotNull
  @Min(0)
  private int chargePoint;

  @NotNull
  @Min(0)
  private int currentPoint;

  private String status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @ManyToOne
  @JoinColumn(name = "manager_id", nullable = true) // 관리자는 데이터 생성시 처음에는 null로 처리해야한다.
  private User manager;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  // function: 포인트 충전을 요청하는 경우 //
  public PointCharge(User user, int currentPoint, int chargePoint) {
    this.user = user;
    this.currentPoint = currentPoint;
    this.chargePoint = chargePoint;
    this.status = "미승인";
    this.createdAt = LocalDateTime.now();
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
