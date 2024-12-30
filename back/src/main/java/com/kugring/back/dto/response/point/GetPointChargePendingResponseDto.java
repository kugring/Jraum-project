package com.kugring.back.dto.response.point;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kugring.back.common.ResponseCode;
import com.kugring.back.common.ResponseMessage;
import com.kugring.back.dto.object.PointChargeRequestListItem;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.entity.PointCharge;

import lombok.Getter;

@Getter
public class GetPointChargePendingResponseDto extends ResponseDto {

    private List<PointChargeRequestListItem> pointChargeList;

    private GetPointChargePendingResponseDto(List<PointCharge> resultSets) {
        super();
        this.pointChargeList = PointChargeRequestListItem.getList(resultSets);
    }

    public static ResponseEntity<GetPointChargePendingResponseDto> success(List<PointCharge> resultSets) {
        GetPointChargePendingResponseDto responseBody = new GetPointChargePendingResponseDto(resultSets);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    // 실패 응답 (매니저 아님)
    public static ResponseEntity<ResponseDto> notExistedManager() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NOT_EXISTED_MANAGER, ResponseMessage.NOT_EXISTED_MANAGER);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

}
