package com.kugring.back.dto.response.option;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.object.OptionListItem;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.repository.resultSet.GetMenuOptionListResultSet;
import lombok.Getter;

@Getter
public class GetMenuOptionResponseDto extends ResponseDto {

  private List<OptionListItem> options;

  private GetMenuOptionResponseDto(List<GetMenuOptionListResultSet> resultSets) {
    super();
    this.options = OptionListItem.getList(resultSets);
  }

    // 성공 응답
    public static ResponseEntity<GetMenuOptionResponseDto> success(List<GetMenuOptionListResultSet> resultSets) {
        GetMenuOptionResponseDto result = new GetMenuOptionResponseDto(resultSets);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    
    // 실패 응답 (Menu create Fail)
    public static ResponseEntity<ResponseDto> existedMenu() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NOT_EXISTED_MENU, ResponseMessage.NOT_EXISTED_MENU);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
