package com.kugring.back.dto.request.manager;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AddNewManagerRequestDto {
    
    private String managerPin;
    private String managerPassword;

    private String newManagerName;
    private String newManagerPin;
    private String newManagerDuty;
    private String newManagerPassword;

}
