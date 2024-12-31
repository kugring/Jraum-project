import styled from 'styled-components'
import { CiEdit } from "react-icons/ci";
import { FaCaretDown } from "react-icons/fa";
import { fileUploadRequest, jraumSignUpRequest, nicknameDpCheckRequest, pinDpCheckRequest } from 'apis';
import { defaultUserImage, formattedPoint } from 'constant';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import useBlackModalStore from 'store/modal/black-modal.store';
import { useCookies } from 'react-cookie';
import { JraumSignUpRequestDto, NicknameDpCheckRequestDto, PinDpCheckRequestDto } from 'apis/request/auth';
import { JraumSignUpResponseDto, NicknameDpcheckResponseDto, PinDpcheckResponseDto } from 'apis/response/auth';
import { ResponseDto } from 'apis/response';


//              component: 회원 등록 모달 컴포넌트                  //
const UserAdd = () => {

    //          state: 쿠키 상태                //
    const [cookies,] = useCookies();
    //          state: 메뉴 이미지 상태             //
    const [profileImage, setProfileImage] = useState<string>('');
    //          state: 핀 상태              //
    const [pin, setPin] = useState<string>("");
    //          state: 핀 가능 상태              //
    const [canPin, setCanPin] = useState<boolean>(false);
    //          state: 이름 상태              //
    const [name, setName] = useState<string>("");
    //          state: 이름 상태              //
    const [initialName, setInitialName] = useState<string>("");
    //          state: 닉네임 상태              //
    const [nickname, setNickname] = useState<string>("");
    //          state: 닉네임 가능 상태              //
    const [canNickname, setCanNickname] = useState<boolean>(false);
    //          state: 전화번호 상태              //
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    //          state: 직접 충전 포인트 상태              //
    const [directPoint, setDirectPoint] = useState<string>("0");
    //            state: 이미지 파일 인풋 참조 상태           //
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    //          state: 드랍다운 열림림 상태              //
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({
        office: false,
        position: false,
    });
    //          state: 드롭다운의 값 상태               //
    const [selectedValues, setSelectedValues] = useState({
        office: "선택",
        position: "선택",
    });
    //          state: 드롭다운의 참조 상태             //
    const officeRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef<HTMLDivElement>(null);

    //          function: 블랙모달 열고 닫는 함수               //
    const closeModal = useBlackModalStore.getState().closeModal;
    //          function: 핀 입력시 중간에 form처리 하는 함수         //
    const handlePinChange = (inputValue: string) => {
        if (inputValue.length > 4) return;
        setPin(inputValue); // 상태에 숫자 값 저장
        if (!cookies.managerToken) return;
        if (inputValue.length === 4) {
            const requestBody: PinDpCheckRequestDto = { pin: inputValue }
            console.log(inputValue);
            pinDpCheckRequest(requestBody, cookies.managerToken).then(pinDpCheckResponse)
        }
    };
    //          function: 주문 완료 처리 이후 함수          //
    const pinDpCheckResponse = (responseBody: PinDpcheckResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMG') alert('관리자 토큰이 만료되었습니다.');
        if (code === 'DP') return setCanPin(false);
        if (code !== 'SU') return;
        setCanPin(true)
    }
    //          function: 이름 입력시 중간에 form처리 하는 함수         //
    const handleNameChange = (inputValue: string) => {
        if (inputValue.length > 8) return;
        setName(inputValue); // 상태에 숫자 값 저장
        setInitialName(getChosung(inputValue)); // 초성을 저장함
    };
    //          function: 한글 초성, 중성, 종성 분리 함수         //
    const getChosung = (name: string): string => {
        const chosungArray = ["ㄱ", "ㄲ", "ㄱ", "ㄴ", "ㄷ", "ㄸ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅂ", "ㅅ", "ㅆ", "ㅅ", "ㅇ", "ㅈ", "ㅉ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

        let chosung = "";

        for (let i = 0; i < name.length; i++) {
            const code = name.charCodeAt(i) - 0xAC00; // 한글 유니코드에서 "가"의 시작 코드
            if (code >= 0 && code <= 11171) { // 한글 음절 영역
                const cho = Math.floor(code / 588); // 초성 인덱스
                chosung += chosungArray[cho]; // 초성 추가
            }
        }
        return chosung;
    };
    //          function: 닉네임 입력시 중간에 form처리 하는 함수         //
    const handleNicknameChange = (inputValue: string) => {
        if (inputValue.length > 15) return;
        setNickname(inputValue); // 상태에 숫자 값 저장
        if (!cookies.managerToken) return;
        if (inputValue.length >= 2) {
            const requestBody: NicknameDpCheckRequestDto = { nickname: inputValue }
            nicknameDpCheckRequest(requestBody, cookies.managerToken).then(nicknameDpCheckResponse)
        }
    };
    //          function: 닉네임 중복 처리 이후 함수          //
    const nicknameDpCheckResponse = (responseBody: NicknameDpcheckResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMG') alert('관리자 토큰이 만료되었습니다.');
        if (code === 'DN') return setCanNickname(false);
        if (code !== 'SU') return;
        setCanNickname(true)
    }
    //          function: 가격 입력시 중간에 form처리 하는 함수         //
    const handlePointChange = (inputValue: string) => {
        if (inputValue.length > 8) return;
        const numericValue = inputValue.replace(/[^0-9]/g, ""); // 숫자 외 제거
        setDirectPoint(numericValue); // 상태에 숫자 값 저장
    };
    //          function: 전화번호 입력시 중간에 포맷을 처리하는 함수
    const handlePhoneNumberChange = (inputValue: string) => {
        // 숫자만 남기기
        const numericValue = inputValue.replace(/[^0-9]/g, "");
        // 010으로 시작하는 전화번호 형식에 맞게 포맷팅
        let formattedValue = "";
        if (numericValue.length > 3 && numericValue.length <= 7) {
            formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
        } else if (numericValue.length > 7 && numericValue.length <= 10) {
            formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
        } else if (numericValue.length > 10 && numericValue.length <= 11) {
            formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7)}`;
        } else if (numericValue.length > 11) {
            return;
        } else {
            formattedValue = numericValue; // 길이가 너무 길면 그대로 두기
        }
        setPhoneNumber(formattedValue); // 상태에 포맷팅된 전화번호 값 저장
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
        if (officeRef.current && !officeRef.current.contains(e.target as Node)) {
            setOpenDropdowns((prev) => ({
                ...prev,
                office: false,
            }));
        }
        if (positionRef.current && !positionRef.current.contains(e.target as Node)) {
            setOpenDropdowns((prev) => ({
                ...prev,
                position: false,
            }));
        }
    };
    //            function: file upload response 처리 함수           //
    const fileUploadResponse = (image: string | null) => {
        if (!image) return
        setProfileImage(image);
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
    const onProfileImageBoxClickHandler = () => {
        if (!imageInputRef.current) return;
        imageInputRef.current.click();
    }

    //          event handler: 회원 등록 버튼 클릭 이벤트 함수         //
    const onUserAddClickHandler = () => {
        if (!cookies.managerToken) return;
        if (selectedValues.position === "선택") return alert("부서를 선택해주세요");
        if (selectedValues.office === "선택") return alert("직책을 선택해주세요");
        if (pin.length !== 4) return alert("회원번호 4자리를 입력해주세요");
        if (!canPin) return alert("회원번호의 중복을 주의해주세요.");
        if (name.length < 2) return alert("이름을 두자리 이상 작성해주세요");
        if (!canNickname) return alert("닉네임의 중복을 주의해주세요.");
        if (directPoint === "") return alert("포인트를 작성해주세요");
        const requestBody: JraumSignUpRequestDto = {
            pin: pin,
            name: name,
            point: parseInt(directPoint, 10),
            office: selectedValues.office,
            position: selectedValues.position,
            nickname: nickname,
            phoneNumber: phoneNumber,
            initialName: initialName,
            profileImage: profileImage
        }
        jraumSignUpRequest(requestBody, cookies.managerToken).then(jraumSignUpResponse)
    };
    //          function: 회원 등록 처리 함수          //
    const jraumSignUpResponse = (responseBody: JraumSignUpResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMG') alert('관리자 토큰이 만료되었습니다.');
        if (code === 'DN') alert('닉네임이 중복되었습니다.');
        if (code === 'DP') alert('회원번호가 중복되었습니다.');
        if (code !== 'SU') return;
        alert('회원 등록되었습니다!')
        closeModal();
    }

    //            effect: 드롭다운 외부 클릭 이벤트 이펙터                //
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //              render: 회원 등록 모달 렌더링                   //
    return (
        <UserAddE>
            <Title>회원 등록</Title>
            <ProfileImageBox onClick={onProfileImageBoxClickHandler}>
                <PropfileImage style={{ backgroundImage: `url(${profileImage ? profileImage : defaultUserImage})` }}></PropfileImage>
                <ProfileImageEdit size={16} />
                <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onImageChangeHandler} />
            </ProfileImageBox>
            <InputContainer>
                <HeaderInputBox>
                    <InputBox ref={positionRef}>
                        <InputTitle>부서*</InputTitle>
                        <DropDown onClick={() => toggleDropdown("position")}>
                            <Value style={{ opacity: selectedValues.position === "선택" ? 0.5 : 1 }}>{selectedValues.position}</Value>
                            <FaCaretDown />
                        </DropDown>
                        <OptionBox $isOpen={openDropdowns.position}>
                            <Option $action={selectedValues.position === "기타"} onClick={() => handleOptionClick("position", "기타")}>기타</Option>
                            <Option $action={selectedValues.position === "유치부"} onClick={() => handleOptionClick("position", "유치부")}>유치부</Option>
                            <Option $action={selectedValues.position === "아동부"} onClick={() => handleOptionClick("ofpositionfice", "아동부")}>아동부</Option>
                            <Option $action={selectedValues.position === "중고등부"} onClick={() => handleOptionClick("position", "중고등부")}>중고등부</Option>
                            <Option $action={selectedValues.position === "청년부"} onClick={() => handleOptionClick("position", "청년부")}>청년부</Option>
                            <Option $action={selectedValues.position === "남전도"} onClick={() => handleOptionClick("position", "남전도")}>남전도</Option>
                            <Option $action={selectedValues.position === "여전도"} onClick={() => handleOptionClick("position", "여전도")}>여전도</Option>
                            <Option $action={selectedValues.position === "교역자"} onClick={() => handleOptionClick("position", "교역자")}>교역자</Option>
                        </OptionBox>
                    </InputBox>
                    <InputBox ref={officeRef}>
                        <InputTitle>직책*</InputTitle>
                        <DropDown onClick={() => toggleDropdown("office")}>
                            <Value style={{ opacity: selectedValues.office === "선택" ? 0.5 : 1 }}>{selectedValues.office}</Value>
                            <FaCaretDown />
                        </DropDown>
                        <OptionBox $isOpen={openDropdowns.office}>
                            <Option $action={selectedValues.office === "성도"} onClick={() => handleOptionClick("office", "성도")}>성도</Option>
                            <Option $action={selectedValues.office === "집사"} onClick={() => handleOptionClick("office", "집사")}>집사</Option>
                            <Option $action={selectedValues.office === "안수집사"} onClick={() => handleOptionClick("office", "안수집사")}>안수집사</Option>
                            <Option $action={selectedValues.office === "권사"} onClick={() => handleOptionClick("office", "권사")}>권사</Option>
                            <Option $action={selectedValues.office === "장로"} onClick={() => handleOptionClick("office", "장로")}>장로</Option>
                            <Option $action={selectedValues.office === "단체"} onClick={() => handleOptionClick("office", "단체")}>단체</Option>
                            <Option $action={selectedValues.office === "기타"} onClick={() => handleOptionClick("office", "기타")}>기타</Option>
                        </OptionBox>
                    </InputBox>
                    <InputBox>
                        <InputTitle>회원번호*
                            {pin.length === 4 &&
                                <Message $action={canPin}>{canPin ? "가능" : "불가능"}</Message>
                            }
                        </InputTitle>
                        <Input value={pin} onChange={(e) => handlePinChange(e.target.value)} placeholder='1234' />
                    </InputBox>
                </HeaderInputBox>
                <InputBox>
                    <InputTitle>이름*</InputTitle>
                    <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder='이름을 입력해주세요' />
                </InputBox>
                <InputBox>
                    <InputTitle>닉네임
                        {nickname.length >= 2 &&
                            <Message $action={canNickname}>{canNickname ? "가능" : "불가능"}</Message>
                        }
                    </InputTitle>
                    <Input value={nickname} onChange={(e) => handleNicknameChange(e.target.value)} placeholder='닉네임을 입력해주세요 (필수 X)' />
                </InputBox>
                <InputBox>
                    <InputTitle>전화번호</InputTitle>
                    <Input value={phoneNumber} onChange={(e) => handlePhoneNumberChange(e.target.value)} placeholder='전화번호를 입력해주세요 (필수 X)' />
                </InputBox>
                <InputBox>
                    <InputTitle>포인트*</InputTitle>
                    <Input value={`${directPoint === "" ? "" : formattedPoint(parseInt(directPoint, 10))}`} onChange={(e) => handlePointChange(e.target.value)} placeholder='포인트를 입력해주세요' />
                </InputBox>
                <Buttons>
                    <Cancel onClick={closeModal}>취소</Cancel>
                    <AddComplete onClick={onUserAddClickHandler}>회원 등록</AddComplete>
                </Buttons>
            </InputContainer>
        </UserAddE>
    )
}
export default UserAdd


const UserAddE = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
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

const ProfileImageBox = styled.div`
    z-index: 1; // 없으면 이미지가 묻힘
    position: absolute;
    left: 113px;
    top: 52px;
    width: 72px;
    height: 72px;
    overflow: hidden;
`

const PropfileImage = styled.img`
    scale: 1.05;
    width: 72px;
    height: 72px;
    border-radius: 12px;
    background-position: center;
    background-size: 100%;
`

const ProfileImageEdit = styled(CiEdit)`
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
    display: flex;
    justify-content: space-between;
    align-items: center;
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

const Message = styled.div<{ $action: boolean }>`
    font-size: 10px;
    color: ${({ $action }) => $action ? "var(--cold)" : "var(--hot)"};
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

const AddComplete = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    border-radius: 4px;
    background: var(--orange, #FC8D08);
`