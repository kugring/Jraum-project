import styled from 'styled-components'
import useOrderStore from 'store/modal/order-list.store';
import useWebSocketStore from 'store/web-socket.store';
import useBlackModalStore from 'store/modal/black-modal.store';
import { HashLoader } from 'react-spinners';
import { ResponseDto } from 'apis/response';
import { formattedPoint } from 'constant';
import { postCashOrderRequest } from 'apis';
import { PostCashOrderRequestDto } from 'apis/request/order';
import { PostCashOrderResponseDto } from 'apis/response/order';
import { memo, useEffect, useState } from 'react';

//          component: 현금 결제 모달 컴포넌트            //
const CashPayModal = () => {


    //          state: 주문의 최종 결제 금액 상태            //
    const totalPrice = useOrderStore.getState().getTotalPrice();


    //          function: 블랙 모달 닫는 함수           //
    const closeModal = useBlackModalStore.getState().closeModal;


    //          render: 현금 결제 모달 렌더링           //
    return (
        <PayModalE>
            <Title>{`카운터에서 현금결제 ^^`}</Title>
            <svg width="100%" height="5"> <line x1="0" y1="5" x2="100%" y2="5" stroke="var(--copperOrange)" strokeWidth="4" strokeDasharray="12, 10" strokeLinecap="round" /> </svg>
            <Info>
                <Text>
                    <div>{'결제 금액:'}</div>
                </Text>
                <Point>
                    <div>{`${formattedPoint(totalPrice)}원`}</div>
                </Point>
            </Info>
            <svg width="100%" height="5"> <line x1="0" y1="5" x2="100%" y2="5" stroke="var(--copperOrange)" strokeWidth="4" strokeDasharray="12, 10" strokeLinecap="round" /> </svg>
            <Buttons>
                <Close onClick={closeModal}>{'이전'}</Close>
                <PayButton />
            </Buttons>
        </PayModalE>
    )
}
export default memo(CashPayModal);


//          component: 결제 대기하는 컴포넌트               //
const PayButton = () => {

    //              state: 웹소켓 연결 상태                 //
    const connected = useWebSocketStore(state => state.connected);
    //              state: 웹소켓 매니저 상태               //
    const { manager } = useWebSocketStore.getState();

    //          state: 주문 버튼 상태           //
    const [action, setAction] = useState<boolean>(false);
    //          state: 주문의 최종 결제 금액 상태            //
    const totalPrice = useOrderStore.getState().getTotalPrice();
    //          function: 블랙 모달 닫는 함수           //
    const closeModal = useBlackModalStore.getState().closeModal;
    //          function: 화이트 모달 설정 함수           //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
    //          function: 주문 대기 인원 설정 함수           //
    const setWaitingNum = useOrderStore.getState().setWaitingNum;
    //          function: 현금 결제 이름 설정 함수           //
    const setCashName = useOrderStore.getState().setCashName;


    //          function: 결제 진행되고 이후의 처리 함수            //
    // 함수: 결제 진행되고 이후의 처리 함수
    const postCashOrderResponse = (responseBody: PostCashOrderResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;

        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'IB') alert('잔액 부족');
        if (code !== 'SU') return;

        // 데이터 가져온것을 분할
        const { order, cashName, waitingNum } = responseBody as PostCashOrderResponseDto;

        // 웹소켓으로 Order 데이터 보내기
        manager?.sendMessage('/send/order', order);

        // 상태 업데이트
        setWaitingNum(waitingNum);
        setCashName(cashName);

        setWhiteModal('현금결제완료');
    }

    //          function: 현금으로 주문 진행하는 함수           //
    const paymentActive = () => {
        //      옵션의 수량이 0인것은 제외함
        const filterZeroOptions = useOrderStore.getState().filterZeroOptions();
        const requestBody: PostCashOrderRequestDto = {
            orderList: filterZeroOptions,
        };
        postCashOrderRequest(requestBody).then(postCashOrderResponse)
    }



    //              function: 현금결제 Ok 웹소켓 구독 핸들러               // 
    const cashPayOkSubWS = () => {
        manager?.subscribe('/receive/user/cashPay', (data) => {
            const { cashPayOk } = data;
            if (cashPayOk) {
                setAction(true)
                paymentActive();
            } else {
                closeModal();
            }
        });
    };

    //              function: 현금 결제 승인 요청 웹소켓 전송 함수               // 
    const cashPayInfoSendWS = (waiting: boolean) => {
        manager?.sendMessage('/send/cashPay/info', {
            totalPrice: totalPrice,
            waiting: waiting
        });
    };

    //              effect: 웹소켓이 연결되면 이후에 구독하는 이펙트                //
    useEffect(() => {
        if (connected) {
            cashPayOkSubWS();
            cashPayInfoSendWS(true);
        }
        return () => {
            cashPayInfoSendWS(false);
        }
    }, [connected])

    //          render: 결제 대기 상태의 버튼 렌더링             //
    return (
        <PayButtonE $action={action}>
            {action ? '결제 완료' : '결제 대기중'}&nbsp;
            {!action && <HashLoader size={24} color='#CA9067' />}
        </PayButtonE>
    )

}

const PayModalE = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 36px 32px 20px 32px;
    box-sizing: border-box;

    border-radius: 26px;
    border: 16px solid var(--goldenOrange);
    background: var(--seashell);
        
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        width: 306px;
        gap: 14px;
        padding: 24px 16px 10px 16px;
        border-radius: 16px;
        border: 10px solid var(--goldenOrange);
    }
`

const Title = styled.div`
    color: var(--amberBrown);
    font-size: 32px;
        
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        font-size: 26px;
    }
`

const Info = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 2px 12px 0px 6px;
    width: 100%;
    box-sizing: border-box;

    font-size: 24px;
    color: var(--copperBrown);
    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        padding: 2px 16px 0px 12px;
        font-size: 16px;
        box-sizing: border-box;
    }
`

const Text = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Point = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
`

const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 58px;
    color: #FFF;
    gap: 20px;
    font-size: 28px;
    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        height: 48px;
        font-size: 20px;
        gap: 12px;
    }
`

const Close = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;

    border-radius: 6px;
    border: 3px solid var(--goldenOrange);
    background: var(--sunsetPeach);
    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        width: 62px;
    }
`

const PayButtonE = styled.div<{ $action: boolean }>`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;

    transform: all 1s;


    @keyframes changeStyles {
    0% {
        border: 4px solid var(--pinkBeige);

    }
    30% {
        border: 4px solid var(--lightBrown);

    }
    60% {
        border: 4px solid var(--lightBrown);
        opacity: 0.8;
    }
    100% {
        border: 4px solid var(--pinkBeige);
    }
}

    ${({ $action }) => $action ?
        `
        color: #FFF;
        border: 4px solid var(--coralPink);
        background: var(--orange);
    `
        :
        `
        color: var(--lightBrown);
        background: var(--creamyYellow);
        opacity: 0.8;
        animation: changeStyles 6s infinite;
    `
    }
`
