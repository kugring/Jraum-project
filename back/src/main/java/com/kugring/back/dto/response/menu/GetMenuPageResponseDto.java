package com.kugring.back.dto.response.menu;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.dto.object.MenuPageListItem;
import com.kugring.back.repository.resultSet.GetMenuPageResultSet;

import lombok.Getter;

@Getter
public class GetMenuPageResponseDto extends ResponseDto {

    private List<MenuPageListItem> menuList;
    private GetMenuPageResponseDto(List<GetMenuPageResultSet> resultSets) {
        super();
        this.menuList = MenuPageListItem.getList(resultSets);
    }

    // 성공 응답
    public static ResponseEntity<GetMenuPageResponseDto> success(List<GetMenuPageResultSet> resultSets) {
        GetMenuPageResponseDto result = new GetMenuPageResponseDto(resultSets);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
