package com.kugring.back.dto.response.order;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.dto.object.OrderManagementListItem;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.repository.resultSet.GetOrderManageMentResultSet;

import lombok.Getter;

@Getter
public class GetOrderManagementResponseDto extends ResponseDto {

  private List<OrderManagementListItem> orders;

  private GetOrderManagementResponseDto(List<GetOrderManageMentResultSet> resultSets) {
    super();
    this.orders = OrderManagementListItem.getList(resultSets);
  }

  // 성공 응답
  public static ResponseEntity<GetOrderManagementResponseDto> success(List<GetOrderManageMentResultSet> resultSets) {
    GetOrderManagementResponseDto result = new GetOrderManagementResponseDto(resultSets);
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

}
