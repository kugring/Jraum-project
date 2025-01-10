import { TEST_DOMAIN } from 'constant';
import React, { useEffect } from 'react';
import useManagerStore from 'store/manager/manager.store';
import useOrderManagementStore from 'store/manager/order-management.store';
import usePointChargeRequestStore from 'store/manager/point-charge-request.store';
import useWebSocketStore from 'store/web-socket.store';

/**
 * WebSocketComponent
 * - WebSocket 연결 및 구독/메시지 전송 기능을 제공하는 컴포넌트입니다.
 */
//          component: 웹소켓 컴포넌트              //
const WebSocket = () => {

    //              state: 웹소켓 스토어 상태               //
    const { initialize, connect, disconnect } = useWebSocketStore();
    //              state: 웹소켓 서버 주소                 //
    const wsUrl = TEST_DOMAIN + '/ws'; // WebSocket 서버 주소
    //              state: 웹소켓 연결 상태                 //
    const connected = useWebSocketStore(state => state.connected);
    //              state: 웹소켓 매니저 상태               //
    const { manager } = useWebSocketStore.getState();

    //              function: 사용자 주문 웹소켓 구독 핸들러               // 
    const OrderSubscribe = () => {
        const addOrder = useOrderManagementStore.getState().addOrder;
        manager?.subscribe('/receive/manager/order', (order) => {
            addOrder(order);
        });
    };

    //              function: 현금 결제 웹소켓 구독 핸들러               // 
    const CashPaySubscribe = () => {
        const setCashPrice = useManagerStore.getState().setCashPrice;
        const setCashPayWaiting = useManagerStore.getState().setCashPayWaiting;
        manager?.subscribe('/receive/manager/cashPay/info', (data) => {
            const { totalPrice, waiting } = data;
            console.log(totalPrice, waiting );
            setCashPayWaiting(waiting);
            setCashPrice(totalPrice);
        });
    };


    //              function: 현금 결제 웹소켓 구독 핸들러               // 
    const PointChargeRequestSubscribe = () => {
        const setChargeRequests = usePointChargeRequestStore.getState().setChargeRequests;
        const chargeRequests = usePointChargeRequestStore.getState().chargeRequests;
        manager?.subscribe('/receive/manager/pointCharge/request', (pointChargeRequest) => {
            setChargeRequests([...chargeRequests, pointChargeRequest]);
        });
    };


    //              event handler: 웹소켓 메제시 전송 핸들러               // 
    const handleSendMessage = () => {
        const { manager } = useWebSocketStore.getState();
        manager?.sendMessage('/send/current/cashPay/info', {  }); // 메시지 전송
    };


    //              effect: 웹소켓 연결 이펙트              //
    useEffect(() => {
        initialize(wsUrl); // WebSocketManager 초기화
        connect(); // WebSocket 연결

        return () => {
            disconnect(); // 컴포넌트 언마운트 시 연결 해제
        };
    }, [initialize, connect, disconnect]);

    //              effect: 웹소켓이 연결되면 이후에 구독하는 이펙트                //
    useEffect(() => {
        if (connected) {
            OrderSubscribe();
            CashPaySubscribe();
            handleSendMessage();
            PointChargeRequestSubscribe();
        }
    }, [connected])

    //              render: 웹소켓 렌더링              //
    return (
        <div>
            <h1>WebSocket with Zustand</h1>
            <button onClick={handleSendMessage}>Send Order Message</button>
        </div>
    );
};

export default WebSocket
