package com.kugring.back.dto.response.point;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.object.PointChargeListItem;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.entity.PointCharge;

import lombok.Getter;

@Getter
public class GetChargeListResponseDto extends ResponseDto {

    private List<PointChargeListItem> chargeList;

    private GetChargeListResponseDto(List<PointCharge> resultSets) {
        super();
        this.chargeList = PointChargeListItem.getList(resultSets);
    }

    public static ResponseEntity<GetChargeListResponseDto> success(List<PointCharge> resultSets) {
        GetChargeListResponseDto result = new GetChargeListResponseDto(resultSets);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> managerNotExisted() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NOT_EXISTED_MANAGER,
                ResponseMessage.NOT_EXISTED_MANAGER);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
