package com.kugring.back.dto.request.order;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostOrderDetailOptionRequestDto {

    @NotNull
    private Long optionId; // 선택한 옵션 ID

    @NotNull
    private Integer quantity; // 옵션 수량

}
