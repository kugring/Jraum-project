package com.kugring.back.dto.response.order;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.object.OrderListListItem;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.repository.resultSet.GetOrderListResultSet;

import lombok.Getter;

@Getter
public class GetOrderListResponseDto extends ResponseDto {

    private List<OrderListListItem> orders;

    private GetOrderListResponseDto(List<GetOrderListResultSet> resultSets) {
        super();
        this.orders = OrderListListItem.getList(resultSets);
    }

    public static ResponseEntity<GetOrderListResponseDto> success(List<GetOrderListResultSet> resultSets) {
        GetOrderListResponseDto result = new GetOrderListResponseDto(resultSets);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> managerNotExisted() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NOT_EXISTED_MANAGER,
                ResponseMessage.NOT_EXISTED_MANAGER);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> noExistOrder() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_ORDER, ResponseMessage.NOT_EXISTED_ORDER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }

}
