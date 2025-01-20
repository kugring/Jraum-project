import { useEffect } from 'react';
import { TEST_DOMAIN } from 'constant';
import useWebSocketStore from 'store/web-socket.store';

//              component: 키오스크 웹소켓 컴포넌트               //
const WebSocket = () => {

    //              state: 웹소켓 스토어 상태               //
    const { initialize, connect, disconnect } = useWebSocketStore();
    //              state: 웹소켓 서버 주소                 //
    const wsUrl = TEST_DOMAIN + '/ws'; // WebSocket 서버 주소
    //              state: 웹소켓 연결 상태                 //
    const connected = useWebSocketStore(state => state.connected);

    //              effect: 웹소켓 연결 이펙트              //
    useEffect(() => {
        initialize(wsUrl); // WebSocketManager 초기화
        connect(); // WebSocket 연결

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            disconnect();
        };
    }, [initialize, connect, disconnect]);

    //              effect: 웹소켓 연결 상태 체크 및 재연결 시도
    useEffect(() => {
        const tryReconnect = () => {
            if (!connected) {
                console.log('WebSocket 연결 실패. 3초 후 재연결 시도...');
                connect(); // 재연결 시도
            }
        };

        if (!connected) {
            const reconnectInterval = setInterval(tryReconnect, 3000); // 3초마다 재연결 시도
            return () => clearInterval(reconnectInterval); // 컴포넌트 언마운트 시 연결 시도 중지
        }
    }, [connected, connect]);

    //              render: 키오스크 웹소켓 렌더링              //
    return (
        <></>
    );
};

export default WebSocket;
