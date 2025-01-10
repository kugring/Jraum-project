import styled from 'styled-components'
import Divider from 'components/Divider'
import { memo } from 'react';
import useOrderStore from 'store/modal/order-list.store';
import usePinUserStore from 'store/pin-user.store'
import { formattedPoint, TEST_DOMAIN } from 'constant';
import useBlackModalStore from 'store/modal/black-modal.store';
import usePointChargeStore from 'store/modal/point-charge-modal.store';
import { postPointOrderRequest } from 'apis';
import { useCookies } from 'react-cookie';
import { PostPointOrderRequestDto } from 'apis/request/order';
import { PostPointOrderResponseDto } from 'apis/response/order';
import { ResponseDto } from 'apis/response';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

//          component: 결제 모달 컴포넌트               //
const PointPayModal = () => {

    //          state: 쿠키 상태                //
    const [cookies,] = useCookies();
    //              state: 충전 요청 상태              //
    usePointChargeStore(state => state.pointChargeId);
    //          state: 핀회원 이름              //
    const name = usePinUserStore.getState().pinUser?.nickname !== null ? usePinUserStore.getState().pinUser?.nickname : usePinUserStore.getState().pinUser?.name;
    //          state: 핀회원 현재 포인트              //
    const point = usePinUserStore.getState().pinUser?.point;
    //          state: 주문의 최종 결제 금액 상태            //
    const totalPrice = useOrderStore.getState().getTotalPrice();
    //      state: 핀 회원 정보         //
    const pinUser = usePinUserStore.getState().pinUser;

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
        // const socket = new SockJS('httplocalhost:4000/ws');
        const socket = new SockJS('https://'+ TEST_DOMAIN +'/ws');

        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');

                // 웹소켓으로 데이터 보내기
                if (client) {
                    client.publish({
                        destination: '/send/order',
                        body: JSON.stringify(order),  // order 객체를 JSON 문자열로 변환
                    });
                } else {
                    console.error('WebSocket not connected');
                }

                // 연결 후 바로 종료
                client.deactivate(); // 데이터 전송 후 연결 종료
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
            }
        });

        // 웹소켓 연결 활성화
        client.activate();

        setPinUser({
            ...pinUser!,
            point: balance,
            name: pinUser!.name,  // 필요한 경우 기본값 추가
        });
        setWaitingNum(waitingNum);
        resetOrderList();
        setWhiteModal('포인트결제완료')
    }

    //          function: 결제를 진행하는 함수          //
    const paymentActive = () => {
        //      옵션의 수량이 0인것은 제외함
        const filterZeroOptions = useOrderStore.getState().filterZeroOptions();
        const requestBody: PostPointOrderRequestDto = {
            orderList: filterZeroOptions,
        };

        postPointOrderRequest(requestBody, cookies.pinToken).then(postPointOrderResponse)
    }




    //          render: 결제 모달 렌더링            //
    return (
        <PayModalE>
            <Title>{`[ ${name} ]님`}&nbsp;&nbsp;{`환영합니다!`}</Title>
            <Divider />
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
                {point! >= totalPrice ?
                    <PayButton onClick={paymentActive}>{'결제하기'}</PayButton>
                    :
                    <PointCharge onClick={pointChargeModal}>{'충전하기'}</PointCharge>
                }
            </Buttons>
        </PayModalE>
    )
}

export default memo(PointPayModal);


const PayModalE = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 36px 38px 20px 38px;
    box-sizing: border-box;

    border-radius: 26px;
    border: 16px solid var(--goldenOrange);
    background: var(--seashell);
`

const Title = styled.div`
    color: var(--amberBrown);
    font-size: 32px;
`

const Info = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 12px 0 6px;
    width: 100%;
    box-sizing: border-box;

    font-size: 24px;
    color: var(--copperBrown);
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
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 58px;
    color: #FFF;
    gap: 24px;
    font-size: 28px;
`

const Close = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;

    border-radius: 6px;
    border: 4px solid var(--goldenOrange);
    background: var(--goldenSun);
`

const PayButton = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 6px;
    border: 4px solid var(--coralPink);
    background: var(--orange);
`

const PointCharge = styled(PayButton)`
`