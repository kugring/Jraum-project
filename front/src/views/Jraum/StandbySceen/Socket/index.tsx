import { useEffect, useState } from 'react';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

//          component: 웹소켓 컴포넌트          //
const WebSocketComponent = () => {

    //          state: 메세지 상태          //
    const [message, setMessage] = useState<string>('');
    //          state: 스톰프 클라이언트 상태           //
    const [stompClient, setStompClient] = useState<Client | null>(null);
    //          state: 컨넥티드 상태            //
    const [connected, setConnected] = useState<boolean>(false);

    //            effect: 웹소켓 연결 이펙트          //
    useEffect(() => {
        // 웹소켓 엔드포인트에 연결
        const socket = new SockJS('http172.30.1.5/ws');

        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');
                setConnected(true); // 연결 성공시 상태 업데이트

                // 메시지 구독
                client.subscribe('/receive/messages', (msg: Message) => {
                    if (msg.body) {
                        console.log('Received: ' + msg.body);
                        setMessage(msg.body);
                    }
                });
            },
            onDisconnect: () => {
                setConnected(false); // 연결 끊어졌을 때 상태 업데이트
            }
        });

        client.activate();

        setStompClient(client);

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, []);


    //          function: 메세지를 보내는 훔수              //
    const sendMessage = () => {
        if (stompClient && connected) {
            stompClient.publish({
                destination: '/send/message',
                body: 'Hello from React',
            });
        } else {
            console.error('WebSocket not connected');
        }
    };


    //          render: 웹소켓 렌더링           //
    return (
        <div>
            <h2>WebSocket Test</h2>
            <button onClick={sendMessage} disabled={!connected}>
                Send Message
            </button>
            <p>Server Response: {message}</p>
        </div>
    );
};

export default WebSocketComponent;
