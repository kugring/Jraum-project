import styled from 'styled-components';
import { CiEdit } from "react-icons/ci";
import { FaCaretDown } from "react-icons/fa";
import { IoCheckbox } from "react-icons/io5";
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'apis/response';
import useBlackModalStore from 'store/modal/black-modal.store';
import { defaultMenuImage, formattedPoint, optionSelectList } from 'constant';
import { PostMenuRequestDto } from 'apis/request/menu';
import { PostMenuResponseDto } from 'apis/response/menu';
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { fileUploadRequest, postMenuRequest } from 'apis';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

//          component: 메뉴 추가 컴포넌트               //
const MenuAdd = () => {

    //          state: 쿠키 상태            //
    const [cookies,] = useCookies(["managerToken"]);
    //          state: 메뉴 이미지 상태             //
    const [menuImage, setMenuImage] = useState<string>('');
    //            state: 이미지 파일 인풋 참조 상태           //
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    //          state: 메뉴 샷 상태           //
    const [shot, setShot] = useState<string>("");
    //          state: 메뉴 이름 상태           //
    const [name, setName] = useState<string>("");
    //          state: 메뉴 가격 상태           //
    const [price, setPrice] = useState<string>("");
    //          state: 메뉴 활성화 상태             //
    const [status, setStatus] = useState<boolean>(false);



    //          state: 드랍다운 열림림 상태              //
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({
        temperature: false,
        category: false,
    });
    //          state: 드롭다운의 값 상태               //
    const [selectedValues, setSelectedValues] = useState({
        temperature: "HOT",
        category: "커피",
    });

    //          state: 드롭다운의 참조 상태             //
    const temRef = useRef<HTMLDivElement>(null);
    const catRef = useRef<HTMLDivElement>(null);


    //          state: 선택된 옵션들 상태               //
    const [options, setOptions] = useState<string[]>([]);

    //          function: 블랙모달 열고 닫는 함수               //
    const closeModal = useBlackModalStore.getState().closeModal;

    //          function: 이름 입력시 중간에 form처리 하는 함수         //
    const handleNameChange = (inputValue: string) => {
        if (inputValue.length > 15) return;
        setName(inputValue); // 상태에 숫자 값 저장
    };
    //          function: 가격 입력시 중간에 form처리 하는 함수         //
    const handlePriceChange = (inputValue: string) => {
        if (inputValue.length > 7) return;
        const numericValue = inputValue.replace(/[^0-9]/g, ""); // 숫자 외 제거
        setPrice(numericValue); // 상태에 숫자 값 저장
    };
    //          function: 샷 입력시 중간에 form처리 하는 함수         //
    const handleShotChange = (inputValue: string) => {
        if (inputValue.length >= 2) return;
        const numericValue = inputValue.replace(/[^0-9]/g, ""); // 숫자 외 제거
        setShot(numericValue); // 상태에 숫자 값 저장
    };

    //          function: 옵션 클릭시 상태 변경 함수            //
    const toggleBadge = (badge: string) => {
        setOptions((prev) =>
            prev.includes(badge) ? prev.filter((item) => item !== badge) : [...prev, badge]
        );
    };

    //          function: 토글을 열고 닫는 함수             //
    const toggleDropdown = (dropdown: string) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown],
        }));
    };

    //          event handler: 드롭박스 옵션 클릭 이벤트 핸들러             //
    const handleOptionClick = (dropdown: string, value: string) => {
        console.log(dropdown, value);
        setSelectedValues((prev) => ({
            ...prev,
            [dropdown]: value,
        }));
        setOpenDropdowns((prev) => ({
            ...prev,
            [dropdown]: false,
        }));
    };
    //          event handler: 드롭박스 외부 클릭 이벤트 핸들러             //
    const handleClickOutside = (e: MouseEvent) => {
        if (temRef.current && !temRef.current.contains(e.target as Node)) {
            setOpenDropdowns((prev) => ({
                ...prev,
                temperature: false,
            }));
        }
        if (catRef.current && !catRef.current.contains(e.target as Node)) {
            setOpenDropdowns((prev) => ({
                ...prev,
                category: false,
            }));
        }
    };
    //            function: file upload response 처리 함수           //
    const fileUploadResponse = (image: string | null) => {
        if (!image) return
        setMenuImage(image);
    }
    //            event handler: 프로필 이미지 변경 이벤트 처리            //
    const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;
        const file = event.target.files[0];
        const data = new FormData();
        data.append('file', file);
        fileUploadRequest(data).then(fileUploadResponse)
    }
    //            event handler: 프로필 박스 클릭 이벤트 처리            //
    const onMenuImageBoxClickHandler = () => {
        if (!imageInputRef.current) return;
        imageInputRef.current.click();
    }
    //          function: 메뉴를 추가하는 함수              //
    const menuAdd = () => {
        if (menuImage === "") return alert("이미지를 업로드 해주세요.")
        if (shot === "") return alert("샷이 필요한 수를 작성해주세요.")
        if (name === "") return alert("메뉴 이름을 작성해주세요.")
        if (price === "") return alert("가격을 작성해주세요.")
        if (options.length < 1) return alert("옵션을 선택해주세요.")
        const requestBody: PostMenuRequestDto = {
            name: name,
            image: menuImage,
            price: parseInt(price, 10),
            status: status ? 0 : 1,
            options: options,
            category: selectedValues.category,
            temperature: selectedValues.temperature,
            espressoShot: parseInt(shot, 10)
        };
        postMenuRequest(requestBody, cookies.managerToken).then(postMenuResponse)
    }

    //          function: 메뉴를 추가 이후 처리함수              //
    const postMenuResponse = (responseBody: PostMenuResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert("데이터베이스 오류입니다.");
        if (code === 'NMN') alert("존재하지 않는 메뉴 입니다.");
        if (code !== 'SU') return;
        closeModal();
        toast.success('정상적으로 메뉴가 추가되었습니다.', {
            autoClose: 1500,
            position: "top-center",
            closeOnClick: true, // 클릭 시 바로 사라짐
        });
    }

    //            effect: 드롭다운 외부 클릭 이벤트 이펙터                //
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //          render: 메뉴 추가 렌더링                //
    return (
        <MenuAddContainer>
            <Title>메뉴 추가</Title>
            <MenuImageBox onClick={onMenuImageBoxClickHandler}>
                <MenuImage style={{ backgroundImage: `url(${menuImage === '' ? defaultMenuImage : menuImage})` }}></MenuImage>
                <MenuImageEdit size={14} />
                <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onImageChangeHandler} />
            </MenuImageBox>
            <InputContainer>
                <MenuState onClick={() => setStatus(!status)} $action={status}>
                    {status ? <IoCheckbox size={14} /> : <MdOutlineCheckBoxOutlineBlank size={14} />}
                    비활성화
                </MenuState>
                <HeaderInputBox>
                    <InputBox ref={temRef}>
                        <InputTitle>온도</InputTitle>
                        <DropDown onClick={() => toggleDropdown("temperature")}>
                            <Value>{selectedValues.temperature}</Value>
                            <FaCaretDown />
                        </DropDown>
                        <OptionBox $isOpen={openDropdowns.temperature}>
                            <Option $action={selectedValues.temperature === "HOT"} onClick={() => handleOptionClick("temperature", "HOT")}>HOT</Option>
                            <Option $action={selectedValues.temperature === "COLD"} onClick={() => handleOptionClick("temperature", "COLD")}>COLD</Option>
                        </OptionBox>
                    </InputBox>
                    <InputBox ref={catRef}>
                        <InputTitle>카테고리</InputTitle>
                        <DropDown onClick={() => toggleDropdown("category")}>
                            <Value>{selectedValues.category}</Value>
                            <FaCaretDown />
                        </DropDown>
                        <OptionBox $isOpen={openDropdowns.category}>
                            <Option $action={selectedValues.category === "커피"} onClick={() => handleOptionClick("category", "커피")}>커피</Option>
                            <Option $action={selectedValues.category === "논커피"} onClick={() => handleOptionClick("category", "논커피")}>논커피</Option>
                            <Option $action={selectedValues.category === "차"} onClick={() => handleOptionClick("category", "차")}>차</Option>
                            <Option $action={selectedValues.category === "음료수"} onClick={() => handleOptionClick("category", "음료수")}>음료수</Option>
                        </OptionBox>
                    </InputBox>
                    <InputBox>
                        <InputTitle>샷</InputTitle>
                        <Input value={shot} onChange={(e) => handleShotChange(e.target.value)} placeholder='0' />
                    </InputBox>
                </HeaderInputBox>
                <InputBox>
                    <InputTitle>메뉴 이름</InputTitle>
                    <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder='이름' />
                </InputBox>
                <InputBox>
                    <InputTitle>가격</InputTitle>
                    <Input value={`${price === "" ? "" : formattedPoint(parseInt(price, 10))}`} onChange={(e) => handlePriceChange(e.target.value)} placeholder='1,234원' />
                </InputBox>
                <InputBox>
                    <InputTitle>옵션</InputTitle>
                    <OptionBadgeBox>
                        {optionSelectList.map((badge) => (
                            <OptionBadge
                                key={badge}
                                $isActive={options.includes(badge)}  // 상태에 따라 활성화/비활성화
                                onClick={() => toggleBadge(badge)}  // 클릭 시 상태 변경
                            >
                                {badge}
                            </OptionBadge>
                        ))}
                    </OptionBadgeBox>
                </InputBox>
                <Buttons>
                    <Cancel onClick={closeModal}>취소</Cancel>
                    <AddComplete onClick={menuAdd}>추가하기</AddComplete>
                </Buttons>
            </InputContainer>
        </MenuAddContainer>
    )
}

export default MenuAdd;

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

const MenuState = styled.div<{ $action: boolean }>`
    display: flex;
    align-items: center;
    gap: 4px;
    position: absolute;
    right: 24.5px;
    top: 11px;
    font-size: 12px;
    ${({ $action }) => $action ? "color: var(--coralSunset)" : "color: #D9D9D9"}
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

const OptionBadge = styled.div<{ $isActive: boolean }>`
  padding: 6px 8px;
  border-radius: 10000px;
  border: 1px solid #d9d9d9;
  background: ${(props) => (props.$isActive ? 'var(--goldenPeach)' : '#FFF')};  // 활성화 시 배경색 변경
  color: ${(props) => (props.$isActive ? '#FFF' : '#D9D9D9')};  // 활성화 시 글자색 변경
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
`;

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
    gap: 12px;
    color: #FFF;
    font-size: 18px;
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

const AddComplete = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    border-radius: 4px;
    background: var(--orange, #FC8D08);
`