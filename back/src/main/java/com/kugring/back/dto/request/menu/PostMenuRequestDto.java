package com.kugring.back.dto.request.menu;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PostMenuRequestDto {

    private String name;
    private String image;
    private String category;
    private String temperature;
    private List<String> options; 
    private int espressoShot;
    private int status;
    private int price;
}
