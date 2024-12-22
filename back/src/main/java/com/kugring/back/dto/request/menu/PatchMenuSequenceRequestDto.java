package com.kugring.back.dto.request.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatchMenuSequenceRequestDto {
    Long menuId;
    int sequence;
}
