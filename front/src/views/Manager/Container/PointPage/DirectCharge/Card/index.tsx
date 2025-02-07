import styled from 'styled-components'
import { toast } from 'react-toastify'
import { isEqual } from 'lodash'
import { useCookies } from 'react-cookie'
import { SortedUser } from 'types/interface'
import { ResponseDto } from 'apis/response'
import { memo, useState } from 'react'
import { useBlackModalStore } from 'store/modal'
import { IoCaretDownOutline } from 'react-icons/io5'
import { usePointDirectChargeStore } from 'store/manager'
import { postPointDirectChargeRequest } from 'apis'
import { PostPointDirectChargeRequestDto } from 'apis/request/pointCharge'
import { PostPointDirectChargeResponseDto } from 'apis/response/pointCharge'
import { defaultUserImage, formattedPoint } from 'constant'

//              component: 포인트 직접 충전 컴포넌트                  //
const Card = ({ user }: { user: SortedUser }) => {

    //              state: 충전 금액 상태                  //
    const [chargePoint, setChargePoint] = useState<number>(0);
    //              state: 보여질 card ID 상태                  //
    const show = usePointDirectChargeStore(state => state.showCard === user.userId);
    //              state: 보여질 card ID 상태                  //
    const setShowCard = usePointDirectChargeStore.getState().setShowCard;

    //              function 함수: 현재 카드를 클릭하면 열리고, 다른 카드 클릭하면 닫힘                  //
    const toggleShow = () => {
        const showCard = usePointDirectChargeStore.getState().showCard;
        setShowCard(showCard === user.userId ? "" : user.userId);
    };
    
    //              render: 포인트 직접 충전 렌더링                 //
    return (
        <CardE>
            <CardBody onClick={toggleShow}>
                <UserInfoE user={user} chargePoint={chargePoint} />
            </CardBody>
            <Direct $show={show}>
                <DirectE user={user} chargePoint={chargePoint} setShow={toggleShow} setChargePoint={setChargePoint} />
            </Direct>
        </CardE>
    );
}
export default memo(Card, (prevProps, nextProps) => isEqual(prevProps.user.userId, nextProps.user.userId));

//              component: 회원 정보 컴포넌트                  //
const UserInfoE = memo(({ user, chargePoint }: { user: SortedUser; chargePoint: number }) => {

    //          state: 포지션 상태          //
    const position = [user.division, user.position].filter(Boolean).join(' / ') || '';

    //              render: 회원 정보 렌더링                  //
    return (
        <>
            <CardLeft>
                <ProfileImage src={user.profileImage ? user.profileImage : defaultUserImage} />
                <UserInfo>
                    <Name>{user.name}</Name>
                    <Position>{position}</Position>
                </UserInfo>
            </CardLeft>
            <PointInfo>
                <Balance>잔액</Balance>
                <CurrentPoint>{formattedPoint(user.point + chargePoint)}원</CurrentPoint>
            </PointInfo>
        </>
    );
});

//              component: 회원 정보 컴포넌트                  //
const DirectE = memo(({ user, chargePoint, setShow, setChargePoint }: {
    user: SortedUser;
    chargePoint: number;
    setShow: (show: boolean) => void;
    setChargePoint: (chargePoint: number) => void;
}) => {

    //              state: 쿠키 상태                //
    const [cookies] = useCookies();

    //              state: 원하는 충전 포인트트 상태                  //
    const directPoint = usePointDirectChargeStore(state => state.directPoint);
    const setDirectPoint = usePointDirectChargeStore(state => state.setDirectPoint);

    //          function: 블랙 모달과 알림창 모달을 위한 함수               //
    const setWhiteModal = useBlackModalStore.getInitialState().setWhiteModal;
    const setCallback = useBlackModalStore.getInitialState().setCallback;
    const setMessage = useBlackModalStore.getInitialState().setMessage;
    const openModal = useBlackModalStore.getState().openModal;

    //          function: 가격 입력시 중간에 form처리 하는 함수         //
    const handlePointChange = (inputValue: string) => {
        if (inputValue.length > 8) return;
        // 첫 글자가 '-'인 경우 유지, 이후 문자에서 숫자만 남김
        const numericValue = inputValue.startsWith('-')
            ? '-' + inputValue.slice(1).replace(/[^0-9]/g, "")
            : inputValue.replace(/[^0-9]/g, "");

        setDirectPoint(numericValue); // 상태에 숫자 값 저장
    };

    //          function:  정렬된 회원 목록 처리 하는는 함수            //
    const postPointDirectChargeResponse = (responseBody: PostPointDirectChargeResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMG') alert('존재하지 않는 관리자입니다.');
        if (code !== 'SU') return;
        setDirectPoint("")
        setShow(false)
        toast.success('정상적으로 충전되었습니다.', {
            autoClose: 500,
            position: "top-center",
            closeOnClick: true, // 클릭 시 바로 사라짐
            pauseOnHover: false
        });
    }
    //          event handler: 직접 충전을 진행하는 함수           //
    const onDirectCharge = () => {
        const requestBody: PostPointDirectChargeRequestDto = {
            userId: user.userId,
            chargePoint: parseInt(directPoint, 10)
        }
        //  두번 연속으로 충전을 하는 경우를 대비해서 기존것에서 더하기!
        setChargePoint(chargePoint + parseInt(directPoint, 10));
        postPointDirectChargeRequest(requestBody, cookies.managerToken).then(postPointDirectChargeResponse)
    }

    //          function: 주문 완료 안내창 뜨우는 함수              //
    const onDirectChargeAlertModalOpen = () => {
        openModal();
        setWhiteModal("안내창");
        setMessage("직접 충전하시겠습니까?")
        setCallback(onDirectCharge);
    }


    //              render: 회원 정보 렌더링                  //
    return (
        <>
            <IoCaretDownOutline color='gray' />
            <DirectInputBox>
                <InputBox>
                    <DirectPoint
                        value={directPoint === "" || directPoint === "-" ? directPoint : formattedPoint(parseInt(directPoint, 10))}
                        onChange={(e) => handlePointChange(e.target.value)}
                        placeholder="포인트를 입력해주세요"
                    />
                    <DirectChargeButton onClick={onDirectChargeAlertModalOpen}>충전</DirectChargeButton>
                </InputBox>
            </DirectInputBox>
        </>
    )
});

const CardE = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 6px;
    border: 1px solid #EABEAB;
    background: #FFF;
`

const CardBody = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

const Direct = styled.div<{ $show: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 4px;

    overflow: hidden;
    transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out; /* 여러 속성에 대한 애니메이션 설정 */

    ${({ $show }) => $show ?
        ` max-height: 150px; opacity: 1; `
        :
        ` max-height: 0; opacity: 0;`}
`

const DirectInputBox = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 6px;
`

const InputBox = styled.div`
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: row;
    width: 100%;
    box-sizing: border-box;
    gap: 8px;
`

const DirectPoint = styled.input`
    flex: 1;
    align-items: center;
    padding: 8px 12px;
    outLine: none;
    font-size: 16px;
    background: #FFF;
    border-radius: 6px;
    font-family: "ONE Mobile POP";
    color: var(--copperBrown);
    border: 1px solid var(--copperRed);

    &::placeholder {
        color: var(--antiqueCream);    // placeholder 색상 설정
        font-size: 14px;    // placeholder 폰트 크기 설정
        font-family: "ONE Mobile POP";  // 원하는 폰트 적용 (선택 사항)
    }
`


const DirectChargeButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 12px;
    border-radius: 4px;
    background: var(--orange, #FC8D08);
    color: #FFF;
    font-size: 16px;
`

const CardLeft = styled.div`
    display: flex;
    gap: 12px;
`
const ProfileImage = styled.img`
    width: 42px;
    height: 42px;
    border-radius: 4px;
`
const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    align-self: stretch;
    padding: 6px 0px 4px 0px;
`
const Name = styled.div`
    color: var(--brickOrange);
    font-size: 16px;
`
const Position = styled.div`
    color: var(--copperBrown);
    font-size: 10px;
`
const PointInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 4px;
    align-items: flex-end;
`

const Balance = styled.div`
    padding: 2px 4px;
    border-radius: 4px;
    background: var(--orange);
    color: #FFF;
    font-size: 12px;
`
const CurrentPoint = styled.div`
    color: var(--lightBrown);
    font-size: 16px;
`