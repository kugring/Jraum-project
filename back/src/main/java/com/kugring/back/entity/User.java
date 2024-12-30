package com.kugring.back.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.kugring.back.dto.request.auth.JraumSignUpRequestDto;
import com.kugring.back.dto.request.auth.SignUpRequestDto;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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

  private int type;
  private int point;
  private String role;
  private int agreement;

  private LocalDateTime createdAt;  // 생성일시
  private LocalDateTime updatedAt;  // 수정일시

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  private List<Order> orders; // 사용자가 만든 주문들

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
  private List<PointCharge> pointcharge;

  public User(JraumSignUpRequestDto dto) {
    this.pin = dto.getPin();
    this.name = dto.getName();
    this.office = dto.getOffice();
    this.position = dto.getPosition();
    this.nickname = dto.getNickname();
    this.phoneNumber = dto.getPhoneNumber();
    this.initialName = dto.getInitialName();
    this.profileImage = dto.getProfileImage();
    this.agreement = 1;
    this.userId = UUID.randomUUID().toString(); // UUID를 생성하여 userId에 할당
    this.point = dto.getPoint();
    this.type = "단체".equals(dto.getOffice()) ? 2 : 1;
    this.role = "ROLE_USER";
  }

  public User(SignUpRequestDto dto) {
    this.userId = dto.getId();
    this.password = dto.getPassword(); // 비밀번호 암호화 고려
    this.email = dto.getEmail();
    this.agreement = 1;
    this.type = 1;
    this.role = "ROLE_USER";
  }

  public User(String userId, String email, int type) {
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
