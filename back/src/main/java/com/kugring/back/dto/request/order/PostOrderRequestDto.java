package com.kugring.back.dto.request.order;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostOrderRequestDto {

  @NotNull
  private List<PostOrderDetailRequestDto> orderList; // 주문 항목 리스트
}
