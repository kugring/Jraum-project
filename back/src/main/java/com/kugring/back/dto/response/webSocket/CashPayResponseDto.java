package com.kugring.back.dto.response.webSocket;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CashPayResponseDto{

    private int totalPrice;
    private boolean waiting;
}
