package com.kugring.back.service.implement;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.kugring.back.dto.request.menu.PatchMenuRequestDto;
import com.kugring.back.dto.request.menu.PatchMenuSequenceRequestDto;
import com.kugring.back.dto.request.menu.PostMenuRequestDto;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.dto.response.auth.PinCheckResponseDto;
import com.kugring.back.dto.response.menu.GetActiveMenuResponseDto;
import com.kugring.back.dto.response.menu.GetMenuPageResponseDto;
import com.kugring.back.dto.response.menu.PatchMenuResponseDto;
import com.kugring.back.dto.response.menu.PatchMenuSequenceResponseDto;
import com.kugring.back.dto.response.menu.PostMenuResponseDto;
import com.kugring.back.entity.Menu;
import com.kugring.back.entity.MenuOption;
import com.kugring.back.entity.User;
import com.kugring.back.repository.MenuRepository;
import com.kugring.back.repository.OptionRepository;
import com.kugring.back.repository.UserRepository;
import com.kugring.back.repository.resultSet.GetActiveMenuListResultSet;
import com.kugring.back.repository.resultSet.GetMenuPageResultSet;
import com.kugring.back.service.MenuService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuServiceImplement implements MenuService {

    private final MenuRepository menuRepository;
    private final UserRepository userRepository;
    private final OptionRepository optionRepository;

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

    @Override
    public ResponseEntity<? super GetMenuPageResponseDto> getMenuPage(String userId, String Category) {
        List<GetMenuPageResultSet> menus;
        try {
            // userId로 데이터 조회
            User user = userRepository.findByUserId(userId);
            // 정보가 없다면 예외처리
            if (user == null)
                return PinCheckResponseDto.pinCheckFail();
            if (!user.getRole().trim().equals("ROLE_ADMIN")) {
                return PinCheckResponseDto.pinCheckFail();
            }
            String category = "모두".equals(Category) ? null : Category;
            menus = menuRepository.findMenuPageByCategory(category);
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetMenuPageResponseDto.success(menus);
    }

    @Override
    @Transactional
    public ResponseEntity<? super PatchMenuSequenceResponseDto> patchMenuSequence(String userId,
            PatchMenuSequenceRequestDto dto) {
        try {
            // userId로 사용자 조회
            User user = userRepository.findByUserId(userId);
            if (user == null) {
                return PinCheckResponseDto.pinCheckFail();
            }

            // 관리자 권한 확인
            if (!"ROLE_ADMIN".equals(user.getRole().trim())) {
                return PatchMenuSequenceResponseDto.notExistedManager();
            }

            // 모든 menuId를 한 번에 조회
            List<Long> menuIds = dto.getMenuSequence()
                    .stream()
                    .map(PatchMenuSequenceRequestDto.MenuSequenceDto::getMenuId)
                    .collect(Collectors.toList());

            // 메뉴 리스트 조회
            List<Menu> menus = menuRepository.findAllById(menuIds);

            // 존재하지 않는 메뉴 확인
            if (menus.size() != menuIds.size()) {
                return PatchMenuSequenceResponseDto.notExistedMenu();
            }

            // 메뉴 순서 업데이트
            Map<Long, Integer> sequenceMap = dto.getMenuSequence()
                    .stream()
                    .collect(Collectors.toMap(
                            PatchMenuSequenceRequestDto.MenuSequenceDto::getMenuId,
                            PatchMenuSequenceRequestDto.MenuSequenceDto::getSequence));

            menus.forEach(menu -> menu.setSequence(sequenceMap.get(menu.getMenuId())));

            // 모든 변경사항 저장
            menuRepository.saveAll(menus);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PatchMenuSequenceResponseDto.success();
    }

    @Override
    public ResponseEntity<? super PostMenuResponseDto> postMenu(String userId, PostMenuRequestDto dto) {
        try {
            // userId로 데이터 조회
            User user = userRepository.findByUserId(userId);
            // 정보가 없다면 예외처리
            if (user == null)
                return PinCheckResponseDto.pinCheckFail();
            if (!user.getRole().trim().equals("ROLE_ADMIN")) {
                return PatchMenuSequenceResponseDto.notExistedManager();
            }

            List<MenuOption> options = new ArrayList<>();
            for (String category : dto.getOptions()) {
                String syrup = "시럽";
                // "시럽"이라는 단어가 들어가 있다면 제거
                if (category.contains(syrup)) {
                    category = category.replace(syrup, "");
                }
                List<MenuOption> item = optionRepository.findByCategory(category);
                options.addAll(item);
            }
            Menu menu = new Menu();
            menu.setName(dto.getName());
            menu.setImage(dto.getImage());
            menu.setPrice(dto.getPrice());
            menu.setStatus(dto.getStatus());
            menu.setCategory(dto.getCategory());
            menu.setTemperature(dto.getTemperature());
            menu.setEspressoShot(dto.getEspressoShot());
            menu.setOptions(options);
            menuRepository.save(menu);
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PostMenuResponseDto.success();
    }

    @Override
    public ResponseEntity<? super PatchMenuResponseDto> patchMenu(String userId, PatchMenuRequestDto dto) {
        try {
            // 유저 권한 확인
            User user = userRepository.findByUserId(userId);
            if (user == null || !user.getRole().trim().equals("ROLE_ADMIN")) {
                return PatchMenuSequenceResponseDto.notExistedManager();
            }

            // 메뉴 조회
            Menu menu = menuRepository.findByMenuId(dto.getMenuId());
            if (menu == null) {
                return PatchMenuSequenceResponseDto.notExistedMenu();
            }

            // options만 제거
            menu.setOptions(null);

            // 변경된 상태 저장
            menu = menuRepository.save(menu);

            // 옵션 처리
            List<MenuOption> options = dto.getOptions().stream()
                    .flatMap(category -> {
                        String syrup = "시럽";
                        if (category.contains(syrup)) {
                            // "시럽"이 포함되어 있으면 시럽을 제거한 detail로 옵션 찾기
                            String detail = category.replace(syrup, "");
                            return optionRepository.findByDetail(detail).stream();
                        } else {
                            // 시럽이 포함되지 않으면 카테고리로 옵션 찾기
                            return optionRepository.findByCategory(category).stream();
                        }
                    })
                    .collect(Collectors.toList());

            // 메뉴 속성 업데이트
            menu.setName(dto.getName());
            menu.setImage(dto.getImage());
            menu.setPrice(dto.getPrice());
            menu.setStatus(dto.getStatus());
            menu.setCategory(dto.getCategory());
            menu.setTemperature(dto.getTemperature());
            menu.setEspressoShot(dto.getEspressoShot());
            menu.setOptions(options);

            System.out.println("추가되는 옵션 이름: " + options.get(0).getCategory());
            System.out.println("추가되는 옵션의 갯수: " + options.size());

            // 메뉴 저장 (속성 업데이트)
            menuRepository.save(menu);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PatchMenuResponseDto.success();
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
    // public ResponseEntity<? super PostMenuResponseDto>
    // postMenu(PostMenuRequestDto dto) {
    // try {
    // // 그대로 정보를 담고 저장
    // Menu Menu = new Menu(dto);

    // // 메뉴 옵션 리스트 생성
    // List<MenuMenuOption> menuOptionListes = new ArrayList<>();

    // // 반복문으로 메뉴옵션엔티티를 생성함
    // for(MenuOptionListObject option : dto.getOptions()){

    // // 옵션엔터티 조회
    // MenuOption optionEntity =
    // optionRepository.findByOptionId(option.getOptionId());

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
    // public ResponseEntity<? super PatchMenuResponseDto> patchMenu(int menuId,
    // PatchMenuRequestDto
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
    // MenuOption optionEntity =
    // optionRepository.findByOptionId(option.getOptionId());

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
