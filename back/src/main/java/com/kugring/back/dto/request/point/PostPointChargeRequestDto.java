package com.kugring.back.dto.request.point;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostPointChargeRequestDto {

  @NotNull
  private int chargePoint;
}
