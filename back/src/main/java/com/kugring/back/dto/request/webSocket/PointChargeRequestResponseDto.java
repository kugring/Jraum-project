package com.kugring.back.dto.request.webSocket;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PointChargeRequestResponseDto {
    private int chargePoint;
    private Long pointChargeId;
    private String status;
}
