import styled from 'styled-components'
import { memo } from 'react'
import { IoClose } from 'react-icons/io5'
import useOrderStore from 'store/modal/order-list.store'
import { useCookies } from 'react-cookie'
import { ResponseDto } from 'apis/response'
import usePinUserStore from 'store/pin-user.store'
import { FaDeleteLeft } from "react-icons/fa6";
import useBlackModalStore from 'store/modal/black-modal.store'
import { formattedPoint } from 'constant'
import usePointChargeStore from 'store/modal/point-charge-modal.store'
import { postPointChargeRequest } from 'apis'
import { PostPointChargeRequestDto } from 'apis/request/pointCharge'
import { PostPointChargeResponseDto } from 'apis/response/pointCharge'
import useWebSocketStore from 'store/web-socket.store'
import { log } from 'console'

//          component: 포인트 충전 모달 텀포넌트            //
const PointChargeModal = () => {


    //          state: 주문 리스트 상태           //
    const orderList = useOrderStore.getState().orderList; // 주문 리스트 가져오기
    //          state: 주문의 최종 결제 금액 상태            //
    const totalPrice = orderList.reduce((total, item) => {
        // item.menuInfo가 null이 아닌 경우에만 가격 계산
        if (item.menuInfo) {
            // 기본 메뉴 가격 계산
            const menuPrice = item.menuInfo.price;

            // 각 옵션 가격 계산 (옵션 수량도 반영)
            const optionsPrice = item.options.reduce((optionTotal, option) => {
                // 옵션에 해당하는 가격을 MenuInfo에서 찾아서 곱함
                const optionInfo = item.menuInfo.options.find(opt => opt.optionId === option.optionId);
                const optionPrice = optionInfo ? optionInfo.price : 0; // 옵션 가격
                return optionTotal + (optionPrice * option.quantity);
            }, 0);

            // 메뉴 가격 + 옵션 가격 합산 후 수량 반영
            return total + ((menuPrice + optionsPrice) * item.quantity);
        }
        // menuInfo가 null일 경우 해당 항목을 0으로 처리
        return total;
    }, 0);
    //          state: 사용자 잔액 상태             //
    const currentPoint = usePinUserStore.getState().pinUser?.point;



    //          function: 블랙 모달 닫는 함수           //
    const closeModal = useBlackModalStore.getState().closeModal;

    //          function: 뱃지로 충전 포인트 편집 함수          //
    const badgeEdit = usePointChargeStore.getState().badgeEdit;
    //          function: 버튼으로 충전 포인트 편집 함수          //
    const buttonEdit = usePointChargeStore.getState().buttonEdit;
    //          function: 충전 포인트 맨 뒷자리 지우는 함수          //
    const handleDelete = usePointChargeStore.getState().handleDelete;

    //          render: 포인트 충전 모달 렌더링             //
    return (
        <PointChargeModalE>
            <Header>
                <Title>{`포인트 충전`}</Title>
                <Close onClick={closeModal} size={42} color='#FFF'></Close>
            </Header>
            <InputValue />
            <MessageBox>{`잔액: ${formattedPoint(currentPoint!)}원 / 결제금액: ${formattedPoint(totalPrice)}원`}</MessageBox>
            <Badges>
                <Badge style={{ background: 'var(--goldenOrange)' }} onClick={() => badgeEdit(1000)}>{`+ 1천원`}</Badge>
                <Badge style={{ background: 'var(--orange)' }} onClick={() => badgeEdit(5000)}>{`+ 5천원`}</Badge>
                <Badge style={{ background: 'var(--brughtOrange)' }} onClick={() => badgeEdit(10000)}>{`+ 1만원`}</Badge>
                <Badge style={{ background: 'var(--coralSunset)' }} onClick={() => badgeEdit(50000)}>{`+ 5만원`}</Badge>
            </Badges>
            <NumberBoard>
                <NumberButton onClick={() => buttonEdit('1')} >1</NumberButton>
                <NumberButton onClick={() => buttonEdit('2')} >2</NumberButton>
                <NumberButton onClick={() => buttonEdit('3')} >3</NumberButton>
                <NumberButton onClick={() => buttonEdit('4')} >4</NumberButton>
                <NumberButton onClick={() => buttonEdit('5')} >5</NumberButton>
                <NumberButton onClick={() => buttonEdit('6')} >6</NumberButton>
                <NumberButton onClick={() => buttonEdit('7')} >7</NumberButton>
                <NumberButton onClick={() => buttonEdit('8')} >8</NumberButton>
                <NumberButton onClick={() => buttonEdit('9')} >9</NumberButton>
                <NumberButton onClick={() => buttonEdit('00')} >00</NumberButton>
                <NumberButton onClick={() => buttonEdit('0')} >0</NumberButton>
                <DeleteButton onClick={handleDelete} size={42} color='var(--copperOrange)'></DeleteButton>
            </NumberBoard>
            <ChargeButton />
        </PointChargeModalE>
    )
}

export default memo(PointChargeModal);

//          component: 충전 입력란 컴포넌트         //
const InputValue = () => {

    //          state: 충전 포인트 가능 상태             //
    const active = usePointChargeStore(state => state.chargePoint > 0)

    //          render: 충전 입력란 렌더링            //
    return (
        <InputValueE>
            {!active ?
                <Placeholder>{'원하시는 충전 금액을 적어주세요'}</Placeholder>
                :
                <ChargePoint>
                    <Point />
                </ChargePoint>
            }
        </InputValueE>
    )
}



//          component: 충전 포인트 컴포넌트         //
const Point = () => {

    //          state: 충전 포인트 상태             //
    const chargePoint = usePointChargeStore(state => state.chargePoint)
    //          render: 충전 포인트 렌더링         //
    return (
        <>
            {`${formattedPoint(chargePoint)} 원`}
        </>
    )
}

//          component: 충전 포인트 컴포넌트         //
const ChargeButton = () => {

    //          state: 충전 포인트 가능 상태             //
    const active = usePointChargeStore(state => state.chargePoint > 0)
    //          state: 충전 포인트 상태             //
    const chargePoint = usePointChargeStore.getState().chargePoint;
    //          state: cookie 상태              //
    const [cookies,] = useCookies();

    //          function: 블랙 모달 종료 함수           //
    const closeModal = useBlackModalStore.getState().closeModal;
    //          function: 화이트 모달 설정 함수           //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
    //          function: 충전 포인트 아이디 설정 함수             //
    const setPointChargeId = usePointChargeStore.getState().setPointChargeId;
    //          function: 충전 포인트 진행 설정 함수             //
    const setCharging = usePointChargeStore.getState().setCharging;
    //          function: 충전 포인트 변경하는 함수             //
    const setChargePoint = usePointChargeStore.getState().setChargePoint;
    //          function: 포인트 충전을 요청하는 함수           //
    const postPointCharge = () => {
        // 포인트 충전이 0이하라면 반환
        if (chargePoint <= 0) return;
        // 핀토콘이 없다면 반환
        if (!cookies.pinToken) return;
        const requestBody: PostPointChargeRequestDto = {
            chargePoint: chargePoint,
        };
        postPointChargeRequest(requestBody, cookies.pinToken).then(postPointChargeResponse)
    }

    //          function: 포인트 충전에 대한 결과 처리 함수             //
    const postPointChargeResponse = (responseBody: PostPointChargeResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;
        const { pointChargeRequest } = responseBody as PostPointChargeResponseDto;

        // 블랙 모달을 종료한다.
        closeModal();
        // pointChardId로 인한 충전버튼의 의존성이 나중에 발동될 수 있게 먼저 결제로 화이트 모달을 설정하고 
        setWhiteModal('포인트결제');
        // 이후에 pointChargeId값을 설정하여 렌더링의 문제가 없도록 한다. 
        setChargePoint(0);
        // 충전 요청의 ID 설정
        setPointChargeId(pointChargeRequest.pointChargeId)
        // 충전 요청의 ID 설정
        setCharging(true)
        console.log("pointChargeRequest: " + pointChargeRequest);

        const { manager } = useWebSocketStore.getState();
        manager?.sendMessage('/send/pointCharge/request', pointChargeRequest); // 메시지 전송
    }




    //          render: 충전 포인트 렌더링         //
    return (
        <ChargeButtonE $action={active} onClick={postPointCharge}>{'충전하기'}</ChargeButtonE>
    )
}


const PointChargeModalE = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 36px 42px 24px 42px;
    width: 480px;
    box-sizing: border-box;
    border-radius: 26px;
    border: 16px solid var(--goldenOrange);
    background: var(--seashell);
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`

const Title = styled.div`
    font-size: 42px;
    color: var(--brickOrange);
`

const Close = styled(IoClose)`
  border-radius: 6px;
  background-color: var(--coralPink);
`;

const InputValueE = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px 26px;
    width: 100%;
    height: 70px;
    box-sizing: border-box;
    margin-top: 20px;
    color: var(--peachPink);
    border-radius: 10px;
    background: #FFF;
    border: 6px solid var(--goldenPeach);
`

const Placeholder = styled.div`
    font-size: 18px;
    color: var(--pinkBeige);
`

const ChargePoint = styled.div`
        font-size: 32px;
        color: var(--copperBrown);
`

const MessageBox = styled.div`
    font-size: 16px;
    padding: 8px 0 16px 0;
    color: var(--coralOrange);
`

const Badges = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: #FFF;
    
`
const Badge = styled.div`
    font-size: 20px;
    padding: 8px 6px;
    border-radius: 6px;
    background-color: var(--orange);
`
const NumberBoard = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 42px;
    width: 100%;
    padding: 6px 0;
`;
const NumberButton = styled.div`
  padding: 18px 0;
  text-align: center;
  font-size: 36px;
  border-radius: 5px;
  cursor: pointer;
  color: var(--copperOrange);
`;

const DeleteButton = styled(FaDeleteLeft)`
  padding: 18px 0;    
  width: 100%;
  font-size: 32px;
  border-radius: 5px;
  cursor: pointer;
  transform: translateX(-4px);
`;

const ChargeButtonE = styled.div<{ $action: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 72px;
    font-size: 36px;
    border-radius: 12px;

    color: ${({ $action }) => $action ? "#FFF" : "var(--pinkBeige)"} ; 
    border: 4px solid ${({ $action }) => $action ? "var(--brughtOrange)" : "var(--pinkBeige)"} ; 
    background-color: ${({ $action }) => $action ? "var(--orange)" : "var(--creamyYellow)"} ;

    transition: all 300ms;
`