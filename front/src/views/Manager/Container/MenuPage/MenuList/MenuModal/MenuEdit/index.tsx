import styled from "styled-components";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { ResponseDto } from "apis/response";
import { useCookies } from "react-cookie";
import { FaCaretDown } from "react-icons/fa";
import { IoCheckbox } from "react-icons/io5";
import { useBlackModalStore } from "store/modal";
import { PatchMenuRequestDto } from "apis/request/menu";
import { PatchMenuResponseDto } from "apis/response/menu";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { fileUploadRequest, patchMenuRequest } from "apis";
import { useMenuPageStore, useMenuPageModalStore } from "store/manager";
import { ChangeEvent, forwardRef, memo, useEffect, useRef } from "react";
import { defaultMenuImage, formattedPoint, optionSelectList } from "constant";
import { useQueryClient } from "@tanstack/react-query";

//          component: 메뉴 수정 모달 컴포넌트              //
const MenuEdit = () => {

    //              state: 리액트 쿼리 상태             //
    const queryClient = useQueryClient(); // React Query 클라이언트 가져오기
    //              state: 쿠키 상태                //
    const [cookies,] = useCookies();
    //              state: 수정할 메뉴 상태             //
    const editMenu = useMenuPageStore.getState().editMenu;

    //              function: 블랙모달 열고 닫는 함수               //
    const closeModal = useBlackModalStore.getState().closeModal;

    //          function: 메뉴를 수정하는 함수              //
    const menuEdit = () => {
        // 상태 가져오기
        const {
            name,
            image,
            price,
            status,
            menuId,
            options,
            selectedValues,
        } = useMenuPageModalStore.getState();

        // 유효성 검사 함수
        const validateInput = () => {
            if (name === "") return "메뉴 이름을 작성해주세요.";
            if (image === "") return "이미지를 업로드 해주세요.";
            if (price === "") return "가격을 작성해주세요.";
            if (options.length < 1) return "옵션을 선택해주세요.";
            if (selectedValues.category === "") return "카테고리 항목을 선택해주세요.";
            if (selectedValues.temperature === "") return "음료의 온도를 선택해주세요.";
            if (selectedValues.espressoShot === "") return "샷이 필요한 수를 작성해주세요.";
            return null;
        };

        // 유효성 검사 실행
        const errorMessage = validateInput();
        if (errorMessage) return alert(errorMessage);

        const requestBody: PatchMenuRequestDto = {
            menuId: menuId,
            name: name,
            image: image,
            price: parseInt(price, 10),
            status: status ? 1 : 0,
            options: options,
            category: selectedValues.category,
            temperature: selectedValues.temperature,
            espressoShot: parseInt(selectedValues.espressoShot, 10),
        };

        patchMenuRequest(requestBody, cookies.managerToken).then(patchMenuResponse)
    }

    //          function: 메뉴를 추가 이후 처리함수              //
    const patchMenuResponse = (responseBody: PatchMenuResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert("데이터베이스 오류입니다.");
        if (code === 'NMN') alert("존재하지 않는 메뉴 입니다.");
        if (code !== 'SU') return;

        closeModal();
        toast.success('메뉴가 수정되었습니다.', {
            autoClose: 500,
            position: "top-center",
            closeOnClick: true, // 클릭 시 바로 사라짐
            pauseOnHover: false
        });


        const filterCategory = useMenuPageStore.getState().category;
        const modalCategory = useMenuPageModalStore.getState().selectedValues.category;
        // 쿼리 무효화
        queryClient.invalidateQueries({queryKey: ['menuListQ', filterCategory]});
        queryClient.invalidateQueries({queryKey: ['menuListQ', modalCategory]});

    }

    //              effect: 컴포넌트 언마운트 시 상태 리셋              //
    useEffect(() => {
        const resetState = useMenuPageModalStore.getState().resetState;
        resetState(editMenu); // user 데이터를 초기값으로 설정
        return () => resetState(null); // 언마운트 시 상태 초기화
    }, [editMenu]);

    //          render: 메뉴 추가 렌더링                //
    return (
        <MenuAddContainer>
            <Title>메뉴 수정</Title>
            <ImageBoxE />
            <InputContainer>
                <MenuStatusE />
                <HeaderInputBox>
                    <DropdownE title={"온도*"} dropdown='temperature' list={["HOT", "COLD"]} />
                    <DropdownE title={"카테고리*"} dropdown='category' list={["커피", "논커피", "차", "음료수"]} />
                    <DropdownE title={"샷*"} dropdown='espressoShot' list={["0", "1", "2", "4"]} />
                </HeaderInputBox>
                <NameInputBoxE />
                <PriceInputBoxE />
                <MenuOptionContainerE />
                <Buttons>
                    <Cancel onClick={closeModal}>취소</Cancel>
                    <AddComplete onClick={menuEdit}>수정하기</AddComplete>
                </Buttons>
            </InputContainer>
        </MenuAddContainer>
    )
};
export default memo(MenuEdit);



//                  component: 이미지 박스 컴포넌트                  //
const ImageBoxE = () => {
    //              state: 메뉴 이미지 상태             //
    const image = useMenuPageModalStore(state => state.image)
    //              state: 이미지 파일 인풋 참조 상태           //
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    //              event handler: 이미지 막스 클릭 이벤트 처리            //
    const onProfileImageBoxClickHandler = () => {
        if (!imageInputRef.current) return;
        imageInputRef.current.click();
    }
    //              function: file upload response 처리 함수           //
    const fileUploadResponse = (image: string | null) => {
        const setImage = useMenuPageModalStore.getState().setImage;
        if (!image) return
        setImage(image);
    }
    //              event handler: 프로필 이미지 변경 이벤트 처리            //
    const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;
        const file = event.target.files[0];
        const data = new FormData();
        data.append('file', file);
        fileUploadRequest(data).then(fileUploadResponse)
    }
    //              render: 프로필 박스 컴포넌트                //
    return (
        <MenuImageBox onClick={onProfileImageBoxClickHandler}>
            <MenuImage style={{ backgroundImage: `url(${image ? image : defaultMenuImage})` }}></MenuImage>
            <MenuImageEdit size={16} />
            <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onImageChangeHandler} />
        </MenuImageBox>
    )
}
//                  component: 메뉴 활성화 컴포넌트                  //
const MenuStatusE = () => {

    const status = useMenuPageModalStore(state => state.status);
    const setStatus = useMenuPageModalStore.getState().setStatus;

    //                  render: 메뉴 활성화 렌더링                  //
    return (
        <MenuState onClick={() => setStatus(!status)} $action={status}>
            <>
                {status ? <MdOutlineCheckBoxOutlineBlank size={14} /> : <IoCheckbox size={14} />}
                <div>비활성화</div>
            </>
        </MenuState>
    )
}
//                  component: 드롭다운 박스 컴포넌트                  //
const DropdownE = memo((({ title, dropdown, list }: { title: string; dropdown: "category" | "temperature" | "espressoShot"; list: string[] }) => {

    //          state: 드롭박스 참조 상태               //
    const dropdownBoxRef = useRef<HTMLDivElement | null>(null)

    //          function: 토글을 열고 닫는 함수             //
    const toggleDropdown = (dropdown: "category" | "temperature" | "espressoShot") => {
        const setOpenDropdowns = useMenuPageModalStore.getState().setOpenDropdowns;
        setOpenDropdowns((prevState) => ({
            ...prevState, // 기존 상태를 유지
            [dropdown]: !prevState[dropdown], // 해당 드롭다운의 상태를 반전시켜서 토글
        }));
    };

    //              render: 드롭박스 박스 컴포넌트                //
    return (
        <InputBox ref={dropdownBoxRef}>
            <InputTitle>{title}</InputTitle>
            <DropDown onClick={() => toggleDropdown(dropdown)}>
                <DropDownValue dropdown={dropdown} />
                <FaCaretDown />
            </DropDown>
            <OptionBoxE ref={dropdownBoxRef} dropdown={dropdown} list={list} />
        </InputBox>
    );
}));
//                  component: 드롭다운 옵션값 컴포넌트                     //
const DropDownValue = ({ dropdown }: { dropdown: "category" | "temperature" | "espressoShot" }) => {

    //          state: 드롭다운 옵션값 상태               //
    const selectedValues = useMenuPageModalStore((state) => state.selectedValues[dropdown]);

    //                  render: 드롭다운 옵션값 렌더링                     //
    return (
        <Value style={{ opacity: selectedValues === "선택" ? 0.5 : 1 }}>{selectedValues}</Value>
    )
}
//                  component: 드롭다운 옵션들 박스 컴포넌트                  //
const OptionBoxE = memo(
    forwardRef<HTMLDivElement, { dropdown: "category" | "temperature" | "espressoShot"; list: string[] }>(
        ({ dropdown, list }, ref) => {

            //          state: 드랍다운 열림 상태              //
            const openDropdowns = useMenuPageModalStore((state) => state.openDropdowns[dropdown]);

            //              event handler: 외부 클릭 감지 핸들러                 //
            const handleClickOutside = (e: MouseEvent) => {
                if (ref && (ref as React.MutableRefObject<HTMLDivElement>).current) {
                    const currentRef = (ref as React.MutableRefObject<HTMLDivElement>).current;
                    if (currentRef && !currentRef.contains(e.target as Node)) {
                        const setOpenDropdowns = useMenuPageModalStore.getState().setOpenDropdowns;
                        setOpenDropdowns((prev) => ({
                            ...prev,
                            [dropdown]: false, // 해당 드롭다운만 닫음
                        }));
                    }
                }
            };

            //              effect: 외부 클릭 이벤트를 등록 및 해제                 //
            useEffect(() => {
                if (openDropdowns) { document.addEventListener("mousedown", handleClickOutside); }
                return () => { document.removeEventListener("mousedown", handleClickOutside); };
            }, [openDropdowns]); // dropdown 변경 시 이벤트를 재설정

            //                  render: 옵션들 박스 렌더링                  //
            return (
                <OptionBox $isOpen={openDropdowns}>
                    {list.map((item) => (
                        <OptionE key={item} item={item} dropdown={dropdown} />
                    ))}
                </OptionBox>
            );
        }
    )
);
//                  component: 드롭다운 옵션 컴포넌트                  //
const OptionE = memo(({ item, dropdown }: { item: string, dropdown: "category" | "temperature" | "espressoShot", }) => {

    //          state: 드롭다운의 값 상태               //
    const selectedValues = useMenuPageModalStore(state => state.selectedValues[dropdown])

    //          event handler: 드롭박스 옵션 클릭 이벤트 핸들러             //
    const handleOptionClick = (dropdown: string, value: string) => {

        const setOpenDropdowns = useMenuPageModalStore.getState().setOpenDropdowns;
        const setSelectedValues = useMenuPageModalStore.getState().setSelectedValues;
        // selectedValues 상태 업데이트
        setSelectedValues((prevState) => ({
            ...prevState, // 이전 상태를 유지하면서
            [dropdown]: value, // 동적으로 키 설정
        }));

        // openDropdowns 상태 업데이트 (해당 드롭다운을 닫음)
        setOpenDropdowns((prevState) => ({
            ...prevState, // 이전 상태를 유지하면서
            [dropdown]: false, // 해당 드롭다운 상태를 닫음
        }));
    };

    //                  render: 드롭다운 옵션 렌더링                  //
    return (
        <Option
            $action={selectedValues === item}
            onClick={() => handleOptionClick(dropdown, item)}
        >
            {item}
        </Option>
    )
})
//                  component: 메뉴 이름 인풋박스 컴포넌트                  //
const NameInputBoxE = () => {
    //                  render: 메뉴 이름 인풋박스 렌더링                  //
    return (
        <InputBox>
            <InputTitle>메뉴 이름</InputTitle>
            <NameInputValue />
        </InputBox>
    )
}
//                  component: 메뉴 이름 값 컴포넌트                //
const NameInputValue = () => {
    //          state: 이름 상태              //
    const name = useMenuPageModalStore(state => state.name)
    //              function: 이름 입력시 중간에 form처리 하는 함수         //
    const handleNameChange = (inputValue: string) => {
        const setName = useMenuPageModalStore.getState().setName;
        if (inputValue.length > 15) return;
        setName(inputValue); // 상태에 숫자 값 저장
    };
    //                  render: 메뉴 이름 값 렌더링                //
    return (
        <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder='이름을 입력해주세요' />
    )
}
//                  component: 메뉴 가격 인풋박스 컴포넌트                  //
const PriceInputBoxE = () => {
    //                  render: 메뉴 가격 인풋박스 렌더링                  //
    return (
        <InputBox>
            <InputTitle>가격</InputTitle>
            <PriceInputValue />
        </InputBox>
    )
}
//                  component: 메뉴 가격 컴포넌트                //
const PriceInputValue = () => {

    //          state: 메뉴 가격 상태              //
    const price = useMenuPageModalStore(state => state.price)
    //          function: 메뉴 가격 설정 함수                //
    const setPrice = useMenuPageModalStore.getState().setPrice;

    //          function: 메뉴 가격 입력시 중간에 form처리 하는 함수         //
    const handlePriceChange = (inputValue: string) => {
        if (inputValue.length > 7) return;
        const numericValue = inputValue.replace(/[^0-9]/g, ""); // 숫자 외 제거
        setPrice(numericValue); // 상태에 숫자 값 저장
    };

    //                  render: 포인트 직접충전 값 렌더링                //
    return (
        <Input value={`${price === "" ? "" : formattedPoint(parseInt(price, 10))}`} onChange={(e) => handlePriceChange(e.target.value)} placeholder='1,234원' />
    )
}
//                  component: 메뉴 옵션 컨테이너 컴포넌트                //
const MenuOptionContainerE = () => {
    //                  render: 메뉴 옵션 박스 렌더링                //
    return (
        <InputBox>
            <InputTitle>옵션</InputTitle>
            <OptionBadgeBox>
                {optionSelectList.map((option) => (
                    <MenuOptionBadgeE key={option} option={option} />
                ))}
            </OptionBadgeBox>
        </InputBox>
    )
}
//                  component: 메뉴 옵션 뱃지 컴포넌트                //
const MenuOptionBadgeE = ({ option }: { option: string }) => {

    //                  state: 메뉴 옵션 상태               //
    const select = useMenuPageModalStore(state => state.options.includes(option));
    //                  function: 옵션 클릭시 상태 변경 함수            //
    const toggleOption = useMenuPageModalStore.getState().toggleOption;
    //                  render: 메뉴 옵션 뱃지 렌더링                //
    return (
        <OptionBadge $select={select} onClick={() => toggleOption(option)}>
            {option}
        </OptionBadge>
    )
}




const MenuAddContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 282px;
    gap: 52px;
    padding-top: 20px;
    border-radius: 12px;
    border: 1px solid #E7D7C7;
    background: var(--creamyYellow);
`

const Title = styled.div`
    color: var(--copperRed);
    font-size: 20px;
`

const MenuImageBox = styled.div`
    z-index: 1; // 없으면 이미지가 묻힘
    position: absolute;
    left: 105px;
    top: 52px;
    width: 72px;
    height: 72px;
    overflow: hidden;
`

const MenuImage = styled.img`
    scale: 1.05;
    width: 72px;
    height: 72px;
    border-radius: 12px;
    background-position: center;
    background-size: 100%;
`

const MenuImageEdit = styled(CiEdit)`
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 2px;
    border-radius: 4px;
    background: var(--lightBrown);
    color: #FFF;
    border: 1px solid #FFF;
`

const InputContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 48px 16px 14px 16px;
    align-self: stretch;
    background: #FFF;
    border-radius: 0 0 12px 12px;
`

const InputBox = styled.div`
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    gap: 2px;
`


const HeaderInputBox = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 12px;
`
const InputTitle = styled.div`
    color: var(--antiqueCream);
    font-size: 12px;
`

const DropDown = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 32px;
    padding: 0 8px;
    color: var(--copperBrown);
    font-size: 16px;
    box-sizing: border-box;
    outline: none;
    border-radius: 4px;
    background: var(--lightCream);
    border: 1px solid #E7D7C7;
    color: var(--lightBrown);
    font-size: 12px;
    &::placeholder {
        color: #D9D9D9;
    }
`

const Value = styled.div`
    color: var(--amberBrown);
`

const OptionBox = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  background-color: white;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const Option = styled.div<{ $action: boolean }>`
    color: #ccc;
    font-size: 12px;
    padding: 8px 10px;
    cursor: pointer;
    border-bottom: 1px solid #ccc;

    &:hover {
        background-color: #f0f0f0;
    }
    ${({ $action }) => $action && `
     color: var(--lightBrown);
     `}

    &:last-child {
        border-bottom: none;
    }
`;

const Input = styled.input`
    width: 100%;
    height: 32px;
    padding: 0 8px;
    color: var(--copperBrown);
    font-size: 16px;
    box-sizing: border-box;
    outline: none;
    border-radius: 4px;
    background: var(--lightCream);
    border: 1px solid #E7D7C7;
    color: var(--amberBrown);
    font-size: 14px;
    &::placeholder {
        color: #d6c4c18f;
    }
    font-family: "ONE Mobile POP";
`

const Buttons = styled.div`
    display: flex;
    width: 100%;
    padding-top: 6px;
    font-size: 18px;
    gap: 12px;
    color: #FFF;
`

const Cancel = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 52px;
    padding: 12px;
    border-radius: 4px;
    background: var(--goldenSun);
`

const MenuState = styled.div<{ $action: boolean }>`
    display: flex;
    align-items: center;
    gap: 4px;
    position: absolute;
    right: 24.5px;
    top: 11px;
    font-size: 12px;
    color: ${({ $action }) => $action ? "#D9D9D9" : "var(--coralSunset)"};
`

const AddComplete = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    border-radius: 4px;
    background: var(--orange, #FC8D08);
`


const OptionBadgeBox = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  align-self: stretch;
  padding: 8px;
  gap: 4px;
  flex-wrap: wrap;
  border-radius: 4px;
  border: 1px solid #e7d7c7;
  background: var(--lightCream, #fcf3e4);
`;

const OptionBadge = styled.div<{ $select: boolean }>`
  padding: 6px 8px;
  border-radius: 10000px;
  border: 1px solid #d9d9d9;
  background: ${(props) => (props.$select ? 'var(--goldenPeach)' : '#FFF')};  // 활성화 시 배경색 변경
  color: ${(props) => (props.$select ? '#FFF' : '#D9D9D9')};  // 활성화 시 글자색 변경
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
`;
