package com.kugring.back.dto.response.menu;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.dto.object.ActiveMenuListItem;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.repository.resultSet.GetActiveMenuListResultSet;
import lombok.Getter;

@Getter
public class GetActiveMenuResponseDto extends ResponseDto {

  private List<ActiveMenuListItem> menuList;

  private GetActiveMenuResponseDto(List<GetActiveMenuListResultSet> resultSets) {
    super();
    this.menuList = ActiveMenuListItem.getList(resultSets);
  }

  // 성공 응답
  public static ResponseEntity<GetActiveMenuResponseDto> success(List<GetActiveMenuListResultSet> resultSets) {
    GetActiveMenuResponseDto result = new GetActiveMenuResponseDto(resultSets);
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }
}
