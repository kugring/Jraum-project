package com.kugring.back.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
  private int managerId;

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
  @JoinColumn(name = "user_id")
  private User user;


  //      function: 포인트 충전을 요청하는 경우       //
  public PointCharge(User user, int currentPoint, int chargePoint) {
    this.user = user;
    this.currentPoint = currentPoint;
    this.chargePoint = chargePoint;
    this.status = "미승인";
    this.createdAt = LocalDateTime.now();
  }




}
