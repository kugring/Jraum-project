import { TEST_DOMAIN } from 'constant';
import { useEffect, useRef } from 'react';
import usePointChargeStore from 'store/modal/point-charge-modal.store';
import useWebSocketStore from 'store/web-socket.store';

//              component: 키오스크 웹소켓 컴포넌트               //
const WSSubscription = () => {

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
                    setMessage("충전 거절");
                } else if (status === "승인") {
                    setMessage("충전 완료");
                }
                setTimeout(() => setMessage("포인트 충전"), 3000);
            }
        });
    };


    //          state: 웹소켓에서 받아올 음성을 저장할 객체 상태                //
    const audioRef = useRef<HTMLAudioElement | null>(null);


    //          function: 주문 음성 듣기 함수               //
    const actionTTS = async (orderId: number) => {
        try {
            // 현재 재생 중인 오디오 세션을 멈춤
            const existingMediaElements = document.querySelectorAll<HTMLMediaElement>('audio, video');
            existingMediaElements.forEach((mediaElement) => {
                if (!mediaElement.paused) {
                    mediaElement.pause();
                }
            });

            const response = await fetch(`${TEST_DOMAIN}/api/v1/order/${orderId}/audio`);
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.oncanplaythrough = () => {
                    console.log('Audio loaded successfully');
                    audioRef.current?.play().catch((error) => {
                        console.error('Audio playback error:', error);
                    });
                };

                audioRef.current.onended = () => {
                    console.log('TTS finished, resuming previous audio.');
                    existingMediaElements.forEach((mediaElement) => {
                        if (mediaElement.dataset.wasPlaying === 'true') {
                            mediaElement.play().catch((error) => {
                                console.error('Error resuming playback:', error);
                            });
                        }
                    });
                };

                audioRef.current.onerror = (error) => {
                    console.error('Audio playback error:', error);
                };
            }
        } catch (error) {
            console.error('Error fetching or playing audio:', error);
        }
    };


    //              function: 사용자 주문 웹소켓 구독 핸들러               // 
    const OrderTTSSubscribe = () => {
        manager?.subscribe('/receive/user/orderTTS', (orderId) => {
            console.log(orderId);
            actionTTS(orderId);
        });
    };

    //              effect: 웹소켓이 연결되면 이후에 구독하는 이펙트                //
    useEffect(() => {
        if (connected) {
            PointChargeRequestSubscribe();
            OrderTTSSubscribe();
        }
    }, [connected]);

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
    );
};

export default WSSubscription;
