package com.kugring.back.entity;

import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.kugring.back.dto.request.manager.AddNewManagerRequestDto;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "`manager`")
@Table(name = "`manager`")
public class Manager {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String managerId;
  private String name;
  private String position;
  private String password;
  private String pin;

  public Manager(AddNewManagerRequestDto dto) {
    this.name = dto.getNewManagerName();
    this.position = dto.getNewManagerDuty();
    this.password = dto.getNewManagerPassword();
    this.pin = dto.getNewManagerPin();
  }

}
