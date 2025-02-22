package com.kugring.back.dto.request.order;


import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostOrderDetailRequestDto {

    @NotNull
    private Long menuId; // 주문한 메뉴 ID

    @NotNull
    private Integer quantity; // 메뉴 수량

    @NotNull
    private List<PostOrderDetailOptionRequestDto> options; // 옵션 리스트
}
