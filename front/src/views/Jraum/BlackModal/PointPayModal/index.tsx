import styled from 'styled-components'
import Divider from 'components/Divider'
import { memo, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'apis/response';
import { formattedPoint } from 'constant';
import { postPointOrderRequest } from 'apis';
import { PostPointOrderRequestDto } from 'apis/request/order';
import { PostPointOrderResponseDto } from 'apis/response/order';
import { usePinUserStore, useWebSocketStore } from 'store';
import { useOrderStore, useBlackModalStore, usePointChargeStore } from 'store/modal';
import { HashLoader } from 'react-spinners';

//                  component: 결제 모달 컴포넌트               //
const PointPayModal = () => {

    //              state: 쿠키 상태                //
    const [cookies,] = useCookies();
    //              state: 충전 요청 상태              //
    usePointChargeStore(state => state.pointChargeId);
    //              state: 핀회원 이름              //
    const name = usePinUserStore.getState().pinUser?.nickname !== null ? usePinUserStore.getState().pinUser?.nickname : usePinUserStore.getState().pinUser?.name;
    //              state: 핀회원 현재 포인트              //
    const point = usePinUserStore.getState().pinUser?.point;
    //              state: 주문의 최종 결제 금액 상태            //
    const totalPrice = useOrderStore.getState().getTotalPrice();
    //              state: 핀 회원 정보         //
    const pinUser = usePinUserStore.getState().pinUser;
    //              state: 중복 요청 방지 상태                   //
    const [isProcessing, setIsProcessing] = useState(false); // ✅ 중복 클릭 방지 상태

    //      function: 핀 회원 정보 수정 함수         //
    const setPinUser = usePinUserStore.getState().setPinUser;
    //          function: 주문 대기 인원 설정 함수           //
    const setWaitingNum = useOrderStore.getState().setWaitingNum;
    //          function: 블랙 모달 닫는 함수           //
    const closeModal = useBlackModalStore.getState().closeModal;
    //          function: 화이트 모달 설정 함수           //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
    //          function: 포인트충전 모달 여는 함수         //
    const pointChargeModal = () => { setWhiteModal('포인트충전') }
    //          function: 주문 리스트 초기화 함수           //
    const resetOrderList = useOrderStore.getState().resetOrderList;


    //          function: 결제 진행되고 이후의 처리 함수            //
    const postPointOrderResponse = (responseBody: PostPointOrderResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'IB') alert('잔액 부족')
        if (code !== 'SU') return;

        // 데이터 가져온것을 분활       
        const { order, balance, waitingNum } = responseBody as PostPointOrderResponseDto;


        // 웹소켓 연결 및 데이터 전송
        const { manager } = useWebSocketStore.getState();
        // 웹소켓으로 Order 데이터 보내기
        manager?.sendMessage('/send/order', order);


        setPinUser({
            ...pinUser!,
            point: balance,
            name: pinUser!.name,  // 필요한 경우 기본값 추가
        });
        setWaitingNum(waitingNum);
        resetOrderList();
        setWhiteModal('포인트결제완료')
    }

    //                  function: 결제를 진행하는 함수                  //
    const paymentActive = () => {
        if (isProcessing) return; // ✅ 이미 결제 중이면 추가 요청 방지
        setIsProcessing(true); // ✅ 결제 요청 시작

        const filterZeroOptions = useOrderStore.getState().filterZeroOptions();
        const requestBody: PostPointOrderRequestDto = {
            orderList: filterZeroOptions,
        };

        console.log(requestBody);


        postPointOrderRequest(requestBody, cookies.pinToken)
            .then(postPointOrderResponse)
            .finally(() => setIsProcessing(false)); // ✅ 요청 완료 후 다시 클릭 가능
    };


    //              effect: 컴포넌트 언마운트 시 isProcessing 초기화            //
    useEffect(() => {
        return () => setIsProcessing(false);
    }, []);


    // 결제 버튼 컴포넌트
    const PaymentButton = ({ point, totalPrice, isProcessing, onPayment, onCharge }: {
        point: number;
        totalPrice: number;
        isProcessing: boolean;
        onPayment: () => void;
        onCharge: () => void;
    }) => {
        const hasEnoughPoints = point >= totalPrice;
        
        return (
            <>
                {hasEnoughPoints ? (
                    <PayButton onClick={onPayment} $action={isProcessing}>
                        {'결제하기'}
                        {isProcessing && <HashLoader size={24} color='#CA9067' />}
                    </PayButton>
                ) : (
                    <PointCharge $action={isProcessing} onClick={onCharge}>
                        {'충전하기'}
                    </PointCharge>
                )}
            </>
        );
    };

    //          render: 결제 모달 렌더링            //
    return (
        <PayModalE>
            <Title>{`[ ${name} ]님`}&nbsp;&nbsp;{`환영합니다!`}</Title>
            <DividerE>
                <Divider />
            </DividerE>
            <Info>
                <Text>
                    <div>{'보유 금액:'}</div>
                    <div>{'결제 금액:'}</div>
                </Text>
                <Point>
                    <div>{formattedPoint(point!)}원</div>
                    <div>{`- ${formattedPoint(totalPrice)}원`}</div>
                </Point>
            </Info>
            <Buttons>
                <Close onClick={closeModal}>{'이전'}</Close>
                <PaymentButton 
                    point={point!} 
                    totalPrice={totalPrice} 
                    isProcessing={isProcessing} 
                    onPayment={paymentActive} 
                    onCharge={pointChargeModal} 
                />
            </Buttons>
        </PayModalE>
    )
}
export default memo(PointPayModal);


const PayModalE = styled.div`
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 36px 38px 20px 38px;
    box-sizing: border-box;

    border-radius: 26px;
    border: 16px solid var(--goldenOrange);
    background: var(--seashell);

    @media (max-width: 768px) {
        gap: 12px;
        padding: 24px 20px 12px 20px;
        border-radius: 20px;
        border: 12px solid var(--goldenOrange);
    }
`

const Title = styled.div`
    flex-shrink: 0;
    color: var(--amberBrown);
    font-size: 32px;

    @media (max-width: 768px) {
        font-size: 24px;
    }
`

const DividerE = styled.div`
    width: 240px;
`

const Info = styled.div`
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 12px 0 6px;
    width: 100%;
    box-sizing: border-box;

    font-size: 24px;
    color: var(--copperBrown);

    @media (max-width: 768px) {
        font-size: 18px;
    }
`

const Text = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
`

const Point = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 14px;
`

const Buttons = styled.div`
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 58px;
    color: #FFF;
    gap: 24px;
    font-size: 28px;

    @media (max-width: 768px) {
        gap: 12px;
        height: 48px;
        font-size: 24px;
    }
`

const Close = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;

    border-radius: 6px;
    border: 4px solid var(--goldenOrange);
    background: var(--goldenSun);

    @media (max-width: 768px) {
        width: 72px;
    }
`

const PayButton = styled.div<{ $action: boolean }>`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 6px;
    border: 4px solid var(--coralPink);
    background: var(--orange);

    
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

    ${({ $action }) => !$action ?
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

const PointCharge = styled(PayButton)`
`