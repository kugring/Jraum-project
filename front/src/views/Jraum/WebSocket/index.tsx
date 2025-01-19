import { useEffect } from 'react';
import { TEST_DOMAIN } from 'constant';
import useWebSocketStore from 'store/web-socket.store';

//              component: 키오스크 웹소켓 컴포넌트               //
const WebSocket = () => {

    //              state: 웹소켓 스토어 상태               //
    const { initialize, connect, disconnect } = useWebSocketStore();
    //              state: 웹소켓 서버 주소                 //
    const wsUrl = TEST_DOMAIN + '/ws'; // WebSocket 서버 주소

    //              effect: 웹소켓 연결 이펙트              //
    useEffect(() => {
        initialize(wsUrl); // WebSocketManager 초기화
        connect(); // WebSocket 연결

        // 컴포넌트 언마운트 시 연결 해제
        return () => { disconnect(); };
    }, [initialize, connect, disconnect]);


    //              render: 키오스크 웹소켓 렌더링              //
    return (
        <></>
    );
};

export default WebSocket;
