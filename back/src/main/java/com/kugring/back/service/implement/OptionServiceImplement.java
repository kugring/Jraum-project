package com.kugring.back.service.implement;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.dto.response.option.GetMenuOptionResponseDto;
import com.kugring.back.repository.OptionRepository;
import com.kugring.back.repository.resultSet.GetMenuOptionListResultSet;
import com.kugring.back.service.OptionService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OptionServiceImplement implements OptionService {

    private final OptionRepository optionRepository;

    @Override
    public ResponseEntity<? super GetMenuOptionResponseDto> getMenuOption(Long menuId) {

        List<GetMenuOptionListResultSet> options = null;

        try {
            options = optionRepository.findByMenuId(menuId);
            if(options == null) return GetMenuOptionResponseDto.existedMenu();

        } catch (Exception exception) {
            exception.printStackTrace();
            ResponseDto.databaseError();
        }

        return GetMenuOptionResponseDto.success(options);
    }

}
