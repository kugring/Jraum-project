package com.kugring.back.dto.response.user;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.object.SortedUserListItem;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.repository.resultSet.GetSortedUserResultSet;

import lombok.Getter;

@Getter
public class GetSortedUserResponseDto extends ResponseDto {

    private List<SortedUserListItem> users;

  private GetSortedUserResponseDto(List<GetSortedUserResultSet> resultSets) {
    super();
    this.users = SortedUserListItem.getList(resultSets);
  }

  public static ResponseEntity<GetSortedUserResponseDto> success(List<GetSortedUserResultSet> resultSets) {
    GetSortedUserResponseDto responseBody = new GetSortedUserResponseDto(resultSets);
    return ResponseEntity.status(HttpStatus.OK).body(responseBody);
  }

  public static ResponseEntity<ResponseDto> notExistedManager() {
    ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_MANAGER, ResponseMessage.NOT_EXISTED_MANAGER);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
  }
}


