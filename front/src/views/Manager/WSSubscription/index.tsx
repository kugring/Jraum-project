import { useEffect } from 'react';
import { useWebSocketStore } from 'store';
import { useManagerStore, useOrderManagementStore, usePointChargeRequestStore } from 'store/manager';

/**
 * WebSocketComponent
 * - WebSocket 연결 및 구독/메시지 전송 기능을 제공하는 컴포넌트입니다.
 */
//          component: 웹소켓 컴포넌트              //
const WSSubscription = () => {

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
            setCashPayWaiting(waiting);
            setCashPrice(totalPrice);
        });
    };

    //              function: 포인트 충전 요청 웹소켓 구독               // 
    const PointChargeRequestSubscribe = () => {
        const setChargeRequests = usePointChargeRequestStore.getState().setChargeRequests;
        const chargeRequests = usePointChargeRequestStore.getState().chargeRequests;
        manager?.subscribe('/receive/manager/pointCharge/request', (pointChargeRequest) => {
            setChargeRequests([...chargeRequests, pointChargeRequest]);
        });
    };

    //              function: 웹소켓 현재 현금결제 요청 상태 요구               // 
    const handleSendMessage = () => {
        const { manager } = useWebSocketStore.getState();
        manager?.sendMessage('/send/current/cashPay/info', {  }); // 메시지 전송
    };

    //              effect: 웹소켓이 연결되면 이후에 구독하는 이펙트                //
    useEffect(() => {
        if (connected) {
            OrderSubscribe();
            CashPaySubscribe();
            handleSendMessage();
            PointChargeRequestSubscribe();
        }

        // Cleanup function: 언마운트 시 구독 해제
        return () => {
            if (manager) {
                manager.unsubscribe('/receive/manager/order');
                manager.unsubscribe('/receive/manager/cashPay/info');
                manager.unsubscribe('/receive/manager/pointCharge/request');
            }
        };
    }, [connected]);

    //              render: 웹소켓 렌더링              //
    return (
        <div>
            <h1>WebSocket with Zustand</h1>
            <button onClick={handleSendMessage}>Send Order Message</button>
        </div>
    );
};

export default WSSubscription;
