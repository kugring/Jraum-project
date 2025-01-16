import styled from 'styled-components'
import { toast } from 'react-toastify'
import { CiEdit } from 'react-icons/ci'
import { useCookies } from 'react-cookie'
import { FaCaretDown } from 'react-icons/fa'
import { ResponseDto } from 'apis/response'
import { useUserPageStore } from 'store/manager'
import { defaultUserImage } from 'constant'
import { useBlackModalStore } from 'store/modal'
import { useUserPageModalStore } from 'store/manager'
import { PatchUserEditRequestDto } from 'apis/request/user'
import { PatchUserEditResponseDto } from 'apis/response/user'
import { ChangeEvent, forwardRef, memo, useEffect, useRef } from 'react'
import { NicknameDpCheckRequestDto, PinDpCheckRequestDto } from 'apis/request/auth'
import { NicknameDpcheckResponseDto, PinDpcheckResponseDto } from 'apis/response/auth'
import { fileUploadRequest, nicknameDpCheckRequest, patchUserEditRequest, pinDpCheckRequest } from 'apis'

//              component: 회원 수정 모달 컴포넌트                  //
const UserEdit = () => {

    //          state: 쿠키 상태                //
    const [cookies,] = useCookies();

    //          state: 상태 가져오기            //
    const user = useUserPageStore.getState().editUser;
    const {
        pin,
        name,
        canPin,
        userId,
        nickname,
        initialName,
        phoneNumber,
        canNickname,
        selectedValues,
        profileImage,
        resetState, // 상태 초기화 함수
    } = useUserPageModalStore.getState();

    //          function: 블랙모달 열고 닫는 함수               //
    const closeModal = useBlackModalStore.getState().closeModal;

    //          event handler: 회원 수정 버튼 클릭 이벤트 함수         //
    const onUserAddClickHandler = () => {
        if (!cookies.managerToken) return;
        if (selectedValues.position === "선택") return alert("부서를 선택해주세요");
        if (selectedValues.office === "선택") return alert("직책을 선택해주세요");
        if (pin.length !== 4) return alert("회원번호 4자리를 입력해주세요");
        if (!canPin) return alert("회원번호의 중복을 주의해주세요.");
        if (name.length < 2) return alert("이름을 두자리 이상 작성해주세요");
        if (!canNickname) return alert("닉네임의 중복을 주의해주세요.");
        const requestBody: PatchUserEditRequestDto = {
            pin: pin,
            name: name,
            userId: userId,
            office: selectedValues.office,
            position: selectedValues.position,
            nickname: nickname,
            phoneNumber: phoneNumber,
            initialName: initialName,
            profileImage: profileImage
        }
        patchUserEditRequest(requestBody, cookies.managerToken).then(patchUserEditResponse)
    };
    //          function: 회원 등록 처리 함수          //
    const patchUserEditResponse = (responseBody: PatchUserEditResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMG') alert('관리자 토큰이 만료되었습니다.');
        if (code === 'DN') alert('닉네임이 중복되었습니다.');
        if (code === 'DP') alert('회원번호가 중복되었습니다.');
        if (code !== 'SU') return;
        toast.success('회원정보가 수정되었습니다.', {
            autoClose: 1500,
            position: "top-center",
            closeOnClick: true, // 클릭 시 바로 사라짐
        });
        closeModal();
    }

    // 컴포넌트 언마운트 시 상태 리셋
    useEffect(() => {
        resetState(user); // user 데이터를 초기값으로 설정
        return () => resetState(null); // 언마운트 시 상태 초기화
    }, [user]);

    //          render: 회원 수정 모달 렌더링               //
    return (
        <UserEditE>
            <Title>회원 수정</Title>
            <ProfileImageBoxE />
            <InputContainer>
                <HeaderInputBox>
                    <DropdownE title={"부서*"} dropdown='position' list={["기타", "유치부", "아동부", "중고등부", "청년부", "남전도", "여전도", "교역자"]} />
                    <DropdownE title={"직책*"} dropdown='office' list={["성도", "집사", "안수집사", "권사", "장로", "단체", "기타"]} />
                    <PinInputBoxE />
                </HeaderInputBox>
                <NameInputBoxE />
                <NicknameInputBoxE />
                <PhoneNumberInputBoxE />
                <Buttons>
                    <Cancel onClick={closeModal}>취소</Cancel>
                    <AddComplete onClick={onUserAddClickHandler}>회원 등록</AddComplete>
                </Buttons>
            </InputContainer>
        </UserEditE>
    )
}

export default memo(UserEdit)


//                  component: 프로필 박스 컴포넌트                  //
const ProfileImageBoxE = () => {

    //              state: 메뉴 이미지 상태             //
    const profileImage = useUserPageModalStore(state => state.profileImage)

    //              state: 이미지 파일 인풋 참조 상태           //
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    //              event handler: 프로필 박스 클릭 이벤트 처리            //
    const onProfileImageBoxClickHandler = () => {
        if (!imageInputRef.current) return;
        imageInputRef.current.click();
    }

    //              function: file upload response 처리 함수           //
    const fileUploadResponse = (image: string | null) => {
        const setProfileImage = useUserPageModalStore.getState().setProfileImage;
        if (!image) return
        setProfileImage(image);
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
        <ProfileImageBox onClick={onProfileImageBoxClickHandler}>
            <PropfileImage style={{ backgroundImage: `url(${profileImage ? profileImage : defaultUserImage})` }}></PropfileImage>
            <ProfileImageEdit size={16} />
            <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onImageChangeHandler} />
        </ProfileImageBox>
    )
}
//                  component: 드롭다운 박스 컴포넌트                  //
const DropdownE = memo((({ title, dropdown, list }: { title: string; dropdown: "office" | "position"; list: string[] }) => {

    //          state: 드롭박스 참조 상태               //
    const dropdownBoxRef = useRef<HTMLDivElement | null>(null)

    //          function: 토글을 열고 닫는 함수             //
    const toggleDropdown = (dropdown: "office" | "position") => {
        const setOpenDropdowns = useUserPageModalStore.getState().setOpenDropdowns;
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
const DropDownValue = ({ dropdown }: { dropdown: "office" | "position" }) => {

    //          state: 드롭다운 옵션값 상태               //
    const selectedValues = useUserPageModalStore((state) => state.selectedValues[dropdown]);

    //                  render: 드롭다운 옵션값 렌더링                     //
    return (
        <Value style={{ opacity: selectedValues === "선택" ? 0.5 : 1 }}>{selectedValues}</Value>
    )
}
//                  component: 드롭다운 옵션들 박스 컴포넌트                  //
const OptionBoxE = memo(
    forwardRef<HTMLDivElement, { dropdown: "office" | "position"; list: string[] }>(
        ({ dropdown, list }, ref) => {

            //          state: 드랍다운 열림 상태              //
            const openDropdowns = useUserPageModalStore((state) => state.openDropdowns[dropdown]);

            //              event handler: 외부 클릭 감지 핸들러                 //
            const handleClickOutside = (e: MouseEvent) => {
                if (ref && (ref as React.MutableRefObject<HTMLDivElement>).current) {
                    const currentRef = (ref as React.MutableRefObject<HTMLDivElement>).current;
                    if (currentRef && !currentRef.contains(e.target as Node)) {
                        const setOpenDropdowns = useUserPageModalStore.getState().setOpenDropdowns;
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
const OptionE = memo(({ item, dropdown }: { item: string, dropdown: "office" | "position", }) => {

    //          state: 드롭다운의 값 상태               //
    const selectedValues = useUserPageModalStore(state => state.selectedValues[dropdown])

    //          event handler: 드롭박스 옵션 클릭 이벤트 핸들러             //
    const handleOptionClick = (dropdown: string, value: string) => {
        const setOpenDropdowns = useUserPageModalStore.getState().setOpenDropdowns;
        const setSelectedValues = useUserPageModalStore.getState().setSelectedValues;
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
//                  component: 회원번호 인풋박스 컴포넌트                  //
const PinInputBoxE = () => {
    //                  render: 회원번호 인풋박스 렌더링                  //
    return (
        <InputBox>
            <InputBoxHeader>
                <InputTitle>회원번호*</InputTitle>
                <PinInputMessageE />
            </InputBoxHeader>
            <PinInputValueE />
        </InputBox>
    )
}
//                  component: 회원번호 메세지 컴포넌트                  //
const PinInputMessageE = () => {
    //          state: 핀 상태              //
    const pinCheck = useUserPageModalStore(state => state.pin.length === 4)
    const canPin = useUserPageModalStore(state => state.canPin)
    //                  render: 회원번호 메세지 렌더링                  //
    return (
        <>{pinCheck && <Message $action={canPin}>{canPin ? "가능" : "불가능"}</Message>}</>
    )
}
//                  component: 회원번호 값 컴포넌트                  //
const PinInputValueE = () => {
    //          state: 쿠키 상태                //
    const [cookies,] = useCookies();
    //          state: 핀 상태              //
    const pin = useUserPageModalStore(state => state.pin)
    //          function: 핀 설정 함수              //
    const setPin = useUserPageModalStore.getState().setPin;
    const setCanPin = useUserPageModalStore.getState().setCanPin;
    //          function: 핀 중복 체크 완료 처리 이후 함수          //
    const pinDpCheckResponse = (responseBody: PinDpcheckResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMG') alert('관리자 토큰이 만료되었습니다.');
        if (code === 'DP') return setCanPin(false);
        if (code !== 'SU') return;
        setCanPin(true)
    }
    //          function: 핀 입력시 중간에 form처리 하는 함수         //
    const handlePinChange = (inputValue: string) => {
        if (inputValue.length > 4) return;
        setPin(inputValue); // 상태에 숫자 값 저장
        if (!cookies.managerToken) return;
        if (inputValue.length === 4) {
            const requestBody: PinDpCheckRequestDto = { pin: inputValue }
            pinDpCheckRequest(requestBody, cookies.managerToken).then(pinDpCheckResponse)
        }
    };
    //                  render: 회원번호 값 렌더링                  //
    return (
        <Input value={pin} onChange={(e) => handlePinChange(e.target.value)} placeholder='1234' />
    )
}
//                  component: 회원 이름 인풋박스 컴포넌트                  //
const NameInputBoxE = () => {
    //                  render: 회원 이름 인풋박스 렌더링                  //
    return (
        <InputBox>
            <InputTitle>이름*</InputTitle>
            <NameInputValue />
        </InputBox>
    )
}
//                  component: 회원 이름 값 컴포넌트                //
const NameInputValue = () => {
    //          state: 이름 상태              //
    const name = useUserPageModalStore(state => state.name)
    //          function: 이름 입력시 중간에 form처리 하는 함수         //
    const handleNameChange = (inputValue: string) => {
        if (inputValue.length > 8) return;
        const setName = useUserPageModalStore.getState().setName;
        const setInitialName = useUserPageModalStore.getState().setInitialName;
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
    //                  render: 회원 이름 값 렌더링                //
    return (
        <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder='이름을 입력해주세요' />
    )
}
//                  component: 닉네임 인풋박스 컴포넌트                  //
const NicknameInputBoxE = () => {
    //                  render: 닉네임 인풋박스 렌더링                  //
    return (
        <InputBox>
            <InputBoxHeader>
                <InputTitle>닉네임</InputTitle>
                <NicknameInputMessageE />
            </InputBoxHeader>
            <NicknameInputValueE />
        </InputBox>
    )
}
//                  component: 닉네임 메세지 컴포넌트                  //
const NicknameInputMessageE = () => {
    //          state: 닉네임 상태              //
    const nicknameCheck = useUserPageModalStore(state => state.nickname.length >= 2)
    const canNickname = useUserPageModalStore(state => state.canNickname)
    //                  render: 회원번호 메세지 렌더링                  //
    return (
        <>{nicknameCheck && <Message $action={canNickname}>{canNickname ? "가능" : "불가능"}</Message>}</>
    )
}
//                  component: 닉네임 값 컴포넌트                  //
const NicknameInputValueE = () => {
    //          state: 쿠키 상태                //
    const [cookies,] = useCookies();
    //          state: 닉네임 상태              //
    const nickname = useUserPageModalStore(state => state.nickname)

    //          function: 닉테임 설정 함수             //
    const setNickname = useUserPageModalStore.getState().setNickname;
    const setCanNickname = useUserPageModalStore.getState().setCanNickname;

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
    //                  render: 닉네임 값 렌더링                  //
    return (
        <Input value={nickname} onChange={(e) => handleNicknameChange(e.target.value)} placeholder='닉네임을 입력해주세요 (필수 X)' />
    )
}
//                  component: 전화번호 인풋박스 컴포넌트                  //
const PhoneNumberInputBoxE = () => {
    //                  render: 회원 전화번호 인풋박스 렌더링                  //
    return (
        <InputBox>
            <InputTitle>전화번호</InputTitle>
            <PhoneNumberInputValue />
        </InputBox>
    )
}
//                  component: 전화번호 값 컴포넌트                //
const PhoneNumberInputValue = () => {
    //          state: 전화번호 상태              //
    const phoneNumber = useUserPageModalStore(state => state.phoneNumber)
    const setPhoneNumber = useUserPageModalStore.getState().setPhoneNumber;
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
    //                  render: 회원 전화번호 값 렌더링                //
    return (
        <Input value={phoneNumber} onChange={(e) => handlePhoneNumberChange(e.target.value)} placeholder='전화번호를 입력해주세요 (필수 X)' />
    )
}


const UserEditE = styled.div`
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

const InputBoxHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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