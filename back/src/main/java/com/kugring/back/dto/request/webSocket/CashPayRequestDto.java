package com.kugring.back.dto.request.webSocket;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CashPayRequestDto {
    private int totalPrice;
    private boolean waiting;
}
