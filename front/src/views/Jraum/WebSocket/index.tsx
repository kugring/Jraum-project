import { TEST_DOMAIN } from 'constant';
import { useEffect, useRef } from 'react'
import usePointChargeStore from 'store/modal/point-charge-modal.store';
import useWebSocketStore from 'store/web-socket.store';

//              component: 키오스크 웹소켓 컴포넌트               //
const WebSocket = () => {

    //              state: 웹소켓 스토어 상태               //
    const { initialize, connect, disconnect } = useWebSocketStore();
    //              state: 웹소켓 서버 주소                 //
    const wsUrl = TEST_DOMAIN + '/ws'; // WebSocket 서버 주소
    //              state: 웹소켓 연결 상태                 //
    const connected = useWebSocketStore(state => state.connected);
    //              state: 웹소켓 매니저 상태               //
    const { manager } = useWebSocketStore.getState();


    //              function: 현금 결제 웹소켓 구독 핸들러               // 
    const PointChargeRequestSubscribe = () => {
        const setCharging = usePointChargeStore.getState().setCharging;
        const setMessage = usePointChargeStore.getState().setMessage;
        manager?.subscribe('/receive/user/pointCharge/requestOk', (pointChargeRequest) => {
            const { pointChargeId, status } = pointChargeRequest;
            const currentPointChargeId = usePointChargeStore.getState().pointChargeId;
            setCharging(false);
            if (currentPointChargeId === pointChargeId) {
                if (status === "거절") {
                    setMessage("충전 거절")
                } else if (status === "승인") {
                    setMessage("충전 완료")
                }
                setTimeout(() => setMessage("포인트 충전"), 3000)
            }
        });
    };


    //          state: 웹소켓에서 받아올 음성을 저장할 객채 상태                //
    const audioRef = useRef<HTMLAudioElement | null>(null);


    //          function: 주문 음성 듣기 함수               //
    const actionTTS = (orderId: number) => {
        fetch(`${TEST_DOMAIN}/api/v1/order/${orderId}/audio`)
        .then((response) => response.blob())  // 오디오 데이터를 blob 형태로 받음
        .then((audioBlob) => {
            const audioUrl = URL.createObjectURL(audioBlob);
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.oncanplaythrough = () => {
                    console.log('Audio loaded successfully');
                    audioRef.current?.play().catch((error) => {
                        console.error('Audio playback error:', error);
                    });
                };

                audioRef.current.onerror = (error) => {
                    console.error('Audio playback error:', error);
                };
            }
        })
        .catch((error) => {
            console.error('Error fetching audio:', error);
        });
    }

    //              function: 사용자 주문 웹소켓 구독 핸들러               // 
    const OrderTTSSubscribe = () => {
        manager?.subscribe('/receive/user/orderTTS', (orderId) => {
            console.log(orderId);
            actionTTS(orderId);
        });
    };



    //              effect: 웹소켓 연결 이펙트              //
    useEffect(() => {
        initialize(wsUrl); // WebSocketManager 초기화
        connect(); // WebSocket 연결

        // 컴포넌트 언마운트 시 연결 해제
        return () => { disconnect() };
    }, [initialize, connect, disconnect]);


    //              effect: 웹소켓이 연결되면 이후에 구독하는 이펙트                //
    useEffect(() => {
        if (connected) {
            PointChargeRequestSubscribe();
            OrderTTSSubscribe();
        }
    }, [connected])

    //              effect: TTS를 위해서 처음 렌더링시 Audio객체를 만듬               //
    useEffect(() => {
        // 오디오 객체 초기화
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        
        audioRef.current.oncanplaythrough = () => {
            console.log('Audio is ready');
        };

        audioRef.current.onerror = (error) => {
            console.error('Audio loading error:', error);
        };

    }, []);


    //              render: 키오스크 웹소켓 렌더링              //
    return (
        <></>
    )
}

export default WebSocket
