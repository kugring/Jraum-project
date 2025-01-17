package com.kugring.back.dto.request.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatchMenuSequenceRequestDto {
    private List<MenuSequenceDto> menuSequence;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MenuSequenceDto {
        private Long menuId;
        private int sequence;
    }
}
