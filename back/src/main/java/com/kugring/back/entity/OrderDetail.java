package com.kugring.back.entity;

import java.util.List;



import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "`order_detail`")
public class OrderDetail {


  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long orderDetailId;

  @ManyToOne
  @JoinColumn(name = "order_id")
  private Order order; // 주문

  @ManyToOne
  @JoinColumn(name = "menu_id")
  private Menu menu; // 메뉴

  private int quantity; // 메뉴 수량

  @OneToMany(mappedBy = "orderDetail", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private List<OrderDetailOption> options; // 옵션 수량들

}
