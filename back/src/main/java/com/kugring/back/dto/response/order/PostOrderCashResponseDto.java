package com.kugring.back.dto.response.order;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.object.OrderManagementListItem;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.repository.resultSet.GetOrderManageMentResultSet;

import lombok.Getter;

@Getter
public class PostOrderCashResponseDto extends ResponseDto {

  private String cashName;
  private long waitingNum;
  private OrderManagementListItem order;

  private PostOrderCashResponseDto(String cashName, long waitingNum, GetOrderManageMentResultSet resultSet) {
    super();
    this.cashName = cashName;
    this.waitingNum = waitingNum;
    this.order = new OrderManagementListItem(resultSet);
  }

  // 성공 응답
  public static ResponseEntity<PostOrderCashResponseDto> success(String cashName, long waitingNum, GetOrderManageMentResultSet resultSet) {
    PostOrderCashResponseDto result = new PostOrderCashResponseDto(cashName, waitingNum, resultSet);
    return ResponseEntity.status(HttpStatus.OK).body(result);
  }

  // 실패 응답 (Order Fail)
  public static ResponseEntity<ResponseDto> orderFail() {
    ResponseDto responseBody = new ResponseDto(ResponseCode.ORDER_FAIL, ResponseMessage.ORDER_FAIL);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
  }

  // 실패 응답 (사용자 없음)
  public static ResponseEntity<ResponseDto> noExistUser() {
    ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
  }

  // 실패 응답 (메뉴 없음)
  public static ResponseEntity<ResponseDto> noExistMenu() {
    ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_MENU, ResponseMessage.NOT_EXISTED_MENU);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
  }

  // 실패 응답 (옵션 없음)
  public static ResponseEntity<ResponseDto> noExistOption() {
    ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_OPTION, ResponseMessage.NOT_EXISTED_OPTION);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
  }

  // 실패 응답 (잔액부족 없음)
  public static ResponseEntity<ResponseDto> insufficientBlance() {
    ResponseDto result = new ResponseDto(ResponseCode.INSUFFICIENT_BALANCE, ResponseMessage.INSUFFICIENT_BALANCE);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
  }

}
