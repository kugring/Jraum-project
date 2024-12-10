package com.kugring.back.entity;

import java.util.List;

import com.kugring.back.dto.request.auth.SignUpRequestDto;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "`user`") // Backtick 사용

public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String pin;
  private String name;
  private String email;
  private String userId;
  private String office;
  private String position;
  private String nickname;
  private String password;
  private String initialName;
  private String phoneNumber;
  private String profileImage;

  private int point;
  private String role;
  private String type;
  private int agreement;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  private List<Order> orders; // 사용자가 만든 주문들

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
  private List<PointCharge> pointcharge;


  public User(SignUpRequestDto dto) {
    this.userId = dto.getId();
    this.password = dto.getPassword(); // 비밀번호 암호화 고려
    this.email = dto.getEmail();
    this.agreement = 1;
    this.type = "app";
    this.role = "ROLE_USER";
  }

  public User(String userId, String email, String type) {
    this.userId = userId;
    this.password = "P!ssw0rd"; // 하드코딩된 비밀번호는 피하세요
    this.email = email;
    this.type = type;
    this.role = "ROLE_USER";
    this.agreement = 1;
  }

  public void pointCharge(int pointCharge) {
    this.point += pointCharge;
  }

  public void pointPay(int pointPay) {
    this.point -= pointPay;
  }

}
