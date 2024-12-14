package com.kugring.back.dto.response.order;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.dto.object.OrderPageListItem;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.repository.resultSet.GetOrderPageResultSet;

import lombok.Getter;

@Getter
public class GetOrderBadgeResponseDto extends ResponseDto {

  private List<OrderPageListItem> orders;

  private GetOrderBadgeResponseDto(List<GetOrderPageResultSet> resultSets) {
    super();
    this.orders = OrderPageListItem.getList(resultSets);
  }

  // 성공 응답
  public static ResponseEntity<GetOrderBadgeResponseDto> success(List<GetOrderPageResultSet> resultSets) {
    GetOrderBadgeResponseDto result = new GetOrderBadgeResponseDto(resultSets);
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

}
