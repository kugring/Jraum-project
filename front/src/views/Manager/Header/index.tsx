import SockJS from 'sockjs-client';
import styled from 'styled-components'
import { useLocation } from 'react-router-dom';
import useOrderManagementStore from 'store/manager/order-management.store';
import { Client, Message } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react'
import { formattedPoint, TEST_DOMAIN } from 'constant';
import OrderPageHeader from './OrderPageHeader';
import PointPageHeader from './PointPageHeader';

//          component: 관리자 헤더 컴포넌트              //
const Header = () => {

    //          state: 현재 주소 상태            //
    const location = useLocation();
    //          state: 현재 주소 상태            //
    const currentPath = location.pathname;
    //          state: 클라이언트 참조 상태         //
    const client = useRef<Client | null>(null);

    //          state: 현금 결제 요청 상태          //
    const [cashPayButton, setcashPayButton] = useState<boolean>(false);
    //          state: 현금 결제 금액 상태          //
    const [totalPrice, setTotalPrice] = useState<number>(0);
    //          state: 현금 결제 안내창 상태            //
    const [cashPayAlert, setcashPayAlert] = useState<boolean>(false);
    //          state: 특정 서브경로에 대한 상태              //
    const isOrderPage = currentPath.endsWith('/order')
    const isPoint = currentPath.endsWith('/point')
    const isUser = currentPath.endsWith('/user');
    const isMenu = currentPath.endsWith('/menu');

    //          function: 주문 추가 함수            //
    const addOrder = useOrderManagementStore.getState().addOrder;

    //          function: 현금 결제 응답하는 함수수            //
    const handleCashPayOk = (cashPayOk: boolean): void => {
        // 서버로 데이터 전송 (연결 끊김 시)
        client.current!.publish({
            destination: '/app/sendCashPayOk',
            body: JSON.stringify({
                cashPayOk: cashPayOk
            })
        });
    };

    //          effect: 웹소켓 연결하는 이펙트              //
    useEffect(() => {
        // 웹소켓 엔드포인트에 연결
        // const socket = new SockJS('httplocalhost:4000/ws');
        const socket = new SockJS('https://'+ TEST_DOMAIN +':4000/ws');

        client.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                // setConnected(true); // 연결 성공시 상태 업데이트
                // 메시지 구독
                client.current!.subscribe('/topic/order', (msg: Message) => {
                    if (msg.body) {
                        const order = JSON.parse(msg.body);
                        addOrder(order);
                        console.log('Received:', order);
                    }
                });
                // 메시지 구독
                client.current!.subscribe('/topic/cashPay/manager', (msg: Message) => {
                    if (msg.body) {
                        const { totalPrice, waiting } = JSON.parse(msg.body);
                        console.log(totalPrice, waiting);

                        setcashPayButton(waiting);
                        setTotalPrice(totalPrice);
                    }
                });
            },
            onDisconnect: () => {
            }
        });
        client.current.activate();
        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            if (client.current) {
                client.current.deactivate();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    //          render: 관리자 헤더 렌더링              //
    return (
        <HeaderE>
            <>
                {isOrderPage &&
                    <OrderPageHeader/>
                }
                {isPoint &&
                    <PointPageHeader/>
                }
                {isUser &&
                    <div>회원 관리</div>
                }
                {isMenu &&
                    <div>메뉴 관리</div>
                }
                {!isOrderPage && !isPoint && !isUser && !isMenu && <div>Manager Main Page</div>}



                {cashPayButton &&
                    <>
                        <CashPayButton onClick={() => setcashPayAlert(true)}>현금</CashPayButton>
                        {cashPayAlert &&
                            <CashPayAlert>
                                <AlertBox>
                                    <Price>{`${formattedPoint(totalPrice)}원`}</Price>
                                    <Buttons>
                                        <Cancel onClick={() => { handleCashPayOk(false); setcashPayAlert(false); }}>취소</Cancel>
                                        <CashOk onClick={() => { handleCashPayOk(true); setcashPayAlert(false); }}>결제완료</CashOk>
                                    </Buttons>
                                </AlertBox>
                            </CashPayAlert>}
                    </>

                }
            </>
        </HeaderE>
    )
}

export default Header

const HeaderE = styled.div`
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    width: 100vw;
    height: 64px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    background: var(--orange);
    color: white;
    font-size: 36px;
`;


const CashPayButton = styled.div`
    position: absolute;
    padding: 8px 12px;
    top: 20%;
    right: 4%;
    font-size: 16px;
    border: 2px solid #FFF;
    border-radius: 8px;
    background-color: var(--coralSunset);
`

const CashPayAlert = styled.div`
    position: fixed;
    inset: 0; /* top: 0; right: 0; bottom: 0; left: 0; 와 동일 */
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1; /* 다른 요소 위에 나타나도록 z-index 설정 */

    display: flex;
    justify-content: center;
    align-items: center;
`;

const AlertBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 260px;
    gap: 20px;
    padding: 24px 16px 12px 16px;
    box-sizing: border-box;
    border-radius: 20px;
    border: 8px solid var(--goldenOrange);
    background: var(--seashell);
`

const Price = styled.div`
    color: var(--amberBrown);
    font-size: 32px;
`

const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 42px;
    color: #FFF;
    gap: 12px;
    font-size: 24px;
`

const CashOk = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    border: 4px solid var(--coralPink);
    background: var(--orange);
`

const Cancel = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 62px;
    border-radius: 6px;
    border: 4px solid var(--goldenOrange);
    background: var(--goldenSun);
`
