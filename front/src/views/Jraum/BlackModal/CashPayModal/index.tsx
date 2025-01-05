import { Client, Message } from '@stomp/stompjs';
import { postCashOrderRequest } from 'apis';
import { PostCashOrderRequestDto } from 'apis/request/order';
import { ResponseDto } from 'apis/response';
import { PostCashOrderResponseDto } from 'apis/response/order';
import { formattedPoint } from 'constant';
import { memo, useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import SockJS from 'sockjs-client';
import useBlackModalStore from 'store/modal/black-modal.store';
import useOrderStore from 'store/modal/order-list.store';
import styled from 'styled-components'

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

        // 웹소켓 연결 및 데이터 전송
        // const socket = new SockJS('httplocalhost:4000/ws');
        const socket = new SockJS('https://hyunam.site/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');

                // 웹소켓으로 데이터 보내기
                if (client) {
                    client.publish({
                        destination: '/app/sendOrder',
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


    //          function: 웹소켓 연결시 관리자에게 현금결제 여부를 확인할 소켓 전달     //
    const handleConnect = (client: Client, totalPrice: number): void => {
        // 메시지 구독
        client.subscribe('/topic/cashPay/user', handleCashPayResponse);

        // 서버로 데이터 전송
        client.publish({
            destination: '/app/sendCashPay',
            body: JSON.stringify({
                totalPrice: totalPrice,
                waiting: true
            })
        });

        console.log("보내짐: " + totalPrice);

    };

    //          function: 컴포넌트가 언마운트 된다면 현금결제 여부 확인 취소함          //
    const handleDisconnect = (client: Client, totalPrice: number): void => {
        // 서버로 데이터 전송 (연결 끊김 시)
        client.publish({
            destination: '/app/sendCashPay',
            body: JSON.stringify({
                totalPrice: totalPrice,
                waiting: false
            })
        });
    };

    //          function: 관리자가 현금을 결제에 대한 승인, 거절에 대한 처리 함수           //
    const handleCashPayResponse = (msg: Message): void => {
        if (msg.body) {
            const cashPayOk: boolean = JSON.parse(msg.body);
            if (cashPayOk) {
                setAction(true)
                paymentActive();
            } else {
                closeModal();
            }
        }
    };

    //          effect: 웹소켓 연결하는 이펙트              //
    useEffect(() => {
        // const socket = new SockJS('httplocalhost:4000/ws');
        const socket = new SockJS('https://hyunam.site/ws');


        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');
                handleConnect(client, totalPrice)
            }

        });

        client.activate();

        return () => {
            // 소켓 연결 해제 전에 메시지 전송
            handleDisconnect(client, totalPrice);
            // 약간의 지연 후 클라이언트 비활성화
            client.deactivate();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



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
`

const Title = styled.div`
    color: var(--amberBrown);
    font-size: 32px;
`

const Info = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 2px 12px 0px 6px;
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
    gap: 20px;
    font-size: 28px;
`

const Close = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;

    border-radius: 6px;
    border: 3px solid var(--goldenOrange);
    background: var(--sunsetPeach);
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
