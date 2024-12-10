package com.kugring.back.entity;

import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
@Table(name = "`menu`")
public class Menu {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "menu_id")
  private Long menuId;

  private String name;
  private String image;
  private String category;
  private String temperature;
  private int price;
  private int status;
  private int sequence;
  private int espressoShot;


    @ManyToMany
    @JoinTable(
        name = "menu_option_mapping", // 중간 테이블 이름
        joinColumns = @JoinColumn(name = "menu_id"), // 메뉴를 참조하는 외래 키
        inverseJoinColumns = @JoinColumn(name = "option_id") // 옵션을 참조하는 외래 키
    )
    private List<MenuOption> options; // 메뉴가 가지는 여러 옵션




}
