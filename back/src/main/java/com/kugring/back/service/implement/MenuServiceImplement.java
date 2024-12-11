package com.kugring.back.service.implement;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.dto.response.menu.GetActiveMenuResponseDto;
import com.kugring.back.repository.MenuRepository;
import com.kugring.back.repository.resultSet.GetActiveMenuListResultSet;
import com.kugring.back.service.MenuService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuServiceImplement implements MenuService {

    private final MenuRepository menuRepository;

    @Override
    public ResponseEntity<? super GetActiveMenuResponseDto> getActiveMenu() {

        List<GetActiveMenuListResultSet> menus;

        try {
            
            // 모든 메뉴 정보를 담는다. (1인것이 정상이다)
            menus = menuRepository.findByStatus(1);
            
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetActiveMenuResponseDto.success(menus);
    }

    // @Override
    // public ResponseEntity<? super getOptionResponseDto> getOption(int menuId) {
    // try {

    // // 메뉴ID를 가지고 해당 옵션들을 가져온다.
    // optionEntities = optionRepository.getOption(menuId);

    // } catch (Exception exception) {
    // exception.printStackTrace();
    // return ResponseDto.databaseError();
    // }

    // return getOptionResponseDto.success(optionEntities);
    // }

    // @Override @Transactional
    // public ResponseEntity<? super PostMenuResponseDto> postMenu(PostMenuRequestDto dto) {
    // try {
    // // 그대로 정보를 담고 저장
    // Menu Menu = new Menu(dto);

    // // 메뉴 옵션 리스트 생성
    // List<MenuMenuOption> menuOptionListes = new ArrayList<>();

    // // 반복문으로 메뉴옵션엔티티를 생성함
    // for(MenuOptionListObject option : dto.getOptions()){

    // // 옵션엔터티 조회
    // MenuOption optionEntity = optionRepository.findByOptionId(option.getOptionId());

    // // 옵션 코드가 아닌 경우 예외처리
    // if (optionEntity == null) return PostMenuResponseDto.menuCreateFail();

    // // 메뉴옵션엔티티 생성
    // MenuMenuOption menuMenuOption = new MenuMenuOption();

    // // 메뉴엔티티와 메뉴를 연동
    // menuMenuOption.setMenu(Menu);

    // // 메뉴엔티티와 옵션을 연동
    // menuMenuOption.setOption(optionEntity);

    // // 생성된 메뉴옵션엔티티를 추가
    // menuOptionListes.add(menuMenuOption);
    // }

    // // 메뉴옵션 정보를 저장
    // Menu.setMenuOptionListes(menuOptionListes);

    // // 메뉴 정보를 저장
    // menuRepository.save(Menu);

    // } catch (Exception exception) {
    // exception.printStackTrace();
    // return ResponseDto.databaseError();
    // }
    // return PostMenuResponseDto.success();
    // }

    // @Override
    // public ResponseEntity<? super PatchMenuResponseDto> patchMenu(int menuId, PatchMenuRequestDto
    // dto) {
    // try {

    // // 메뉴 조회하기
    // Menu Menu = menuRepository.findByMenuId(menuId);

    // // 데이터 수정하기
    // Menu.patchMenu(dto);

    // // 메뉴 옵션 리스트 가져오기
    // List<MenuMenuOption> menuOptionListes = Menu.getMenuOptionListes();

    // // 옵션 초기화하기
    // menuOptionListes.clear();

    // // 반복문으로 메뉴옵션엔티티를 생성함
    // for(MenuOptionListObject option : dto.getOptions()){

    // // 옵션엔터티 조회
    // MenuOption optionEntity = optionRepository.findByOptionId(option.getOptionId());

    // // 옵션 코드가 아닌 경우 예외처리
    // if (optionEntity == null) return PatchMenuResponseDto.menuPatchFail();

    // // 메뉴옵션엔티티 생성
    // MenuMenuOption menuMenuOption = new MenuMenuOption();

    // // 메뉴엔티티와 메뉴를 연동
    // menuMenuOption.setMenu(Menu);

    // // 메뉴엔티티와 옵션을 연동
    // menuMenuOption.setOption(optionEntity);

    // // 생성된 메뉴옵션엔티티를 추가
    // menuOptionListes.add(menuMenuOption);
    // }

    // // 메뉴옵션 정보를 저장
    // Menu.setMenuOptionListes(menuOptionListes);

    // // 메뉴 정보를 저장
    // menuRepository.save(Menu);

    // } catch (Exception exception) {
    // exception.printStackTrace();
    // return ResponseDto.databaseError();
    // }
    // return PatchMenuResponseDto.success();
    // }

};
