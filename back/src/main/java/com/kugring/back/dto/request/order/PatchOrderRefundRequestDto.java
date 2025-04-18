package com.kugring.back.dto.request.order;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatchOrderRefundRequestDto {

    @NotNull
    private Long orderId; 
}
