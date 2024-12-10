package com.kugring.back.entity;


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


@Entity
@Table(name = "`order_detail_option`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailOption  {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "order_detail_id")
  private OrderDetail orderDetail; // 해당 주문 항목

  @ManyToOne
  @JoinColumn(name = "menu_option_id")
  private MenuOption menuOption; // 선택된 메뉴 옵션

  private int quantity; // 옵션 수량


}

