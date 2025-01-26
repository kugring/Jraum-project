import { TEST_DOMAIN } from 'constant';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    // 추가
    const playFakeAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.src = "/dingdong.mp3";  // public 디렉토리에 있는 dingdong.mp3 파일을 로드
            audioRef.current.muted = true;
            audioRef.current.onplay = null;
            audioRef.current.onended = null;
            setTimeout(() => {
                audioRef.current!.muted = false;
                audioRef.current!.onplay = null;
            }, 100);
            setTimeout(() => {
                audioRef.current!.muted = true;
                audioRef.current!.onplay = null;
            }, 1800);
        }
    }, []);

    //          function: 주문 음성 듣기 함수               //
    const fetchAudioSrc = useCallback((orderId: number) => {
        playFakeAudio(); // 추가

        setTimeout(async () => {
            // TTS 음성을 즉시 불러옵니다.
            const response = await fetch(`${TEST_DOMAIN}/api/v1/order/${orderId}/audio`);
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // setAudioSrc를 2초 후에 실행합니다.
            setTimeout(() => {
                setAudioSrc(audioUrl);
            }, 2000);
        }, 0);

    }, []);

    //          effect: TTS 음성이 바뀌면 Audio 객체에 새로운 src를 넣어줌               //
    useEffect(() => {
        if (audioRef.current && audioSrc) {
            // 기존 AudioContext가 없으면 생성
            if (!audioContextRef.current) {
                const audioContext = new (window.AudioContext)();
                const gainNode = audioContext.createGain();
                const sourceNode = audioContext.createMediaElementSource(audioRef.current);

                // 노드 연결: Audio > GainNode > Destination
                sourceNode.connect(gainNode);
                gainNode.connect(audioContext.destination);

                // GainNode와 AudioContext 저장
                audioContextRef.current = audioContext;
                gainNodeRef.current = gainNode;
            }

            // GainNode의 gain 값을 조정 (2배로 설정)
            if (gainNodeRef.current) {
                gainNodeRef.current.gain.value = 20.0; // 음량을 2배로 증폭
            }

            // 새로운 src 설정
            audioRef.current.src = audioSrc;
            audioRef.current.muted = false;

            audioRef.current.onplay = () => {
                console.log('Audio playback started');
            };
            audioRef.current.onended = () => {
                console.log('Audio playback finished');
            };
        }
    }, [audioSrc]);


    //              function: 사용자 주문 웹소켓 구독 핸들러               // 
    const OrderTTSSubscribe = () => {
        manager?.subscribe('/receive/user/orderTTS', (orderId) => {
            console.log(orderId);
            fetchAudioSrc(orderId);
        });
    };

    //              effect: 웹소켓이 연결되면 이후에 구독하는 이펙트                //
    useEffect(() => {
        if (connected) {
            PointChargeRequestSubscribe();
            OrderTTSSubscribe();
        }

        // Cleanup function: 언마운트 시 구독 해제
        return () => {
            if (manager) {
                manager.unsubscribe('/receive/user/pointCharge/requestOk');
                manager.unsubscribe('/receive/user/orderTTS');
            }
        };
    }, [connected]);

    //              render: 키오스크 웹소켓 렌더링              //
    return (
        <>
            <audio autoPlay hidden ref={audioRef} /> {/* autoPlay 추가 */}
        </>
    );
};

export default WSSubscription;
