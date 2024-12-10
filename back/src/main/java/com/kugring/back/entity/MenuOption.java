package com.kugring.back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "`menu_option`")
public class MenuOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_id")
    private Long optionId;
    private String type;
    private String detail;
    private String category;
    private int price;
    private int status;
    private int sequence;

    @ManyToMany(mappedBy = "options")
    private List<Menu> menus; // 옵션이 속한 여러 메뉴
}
