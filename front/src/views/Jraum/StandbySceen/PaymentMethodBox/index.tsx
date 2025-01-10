import Divider from 'components/Divider'
import { TEST_DOMAIN } from 'constant';
import { memo, useEffect, useRef } from 'react';
import { useWebSocketStore } from 'store';
import useBlackModalStore from 'store/modal/black-modal.store';
import usePinUserStore from 'store/pin-user.store';
import styled from 'styled-components'

//          component: 결제 방식 박스 컴포넌트             //
const PaymentMethodBox = () => {

    //          function: 블랙 모달 여는 함수           //
    const openModal = useBlackModalStore.getState().openModal;
    //          function: 화이트 모달 설정하는 함수           //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
    //      function: 결제 방식 설정하는 함수         //
    const setPayment = usePinUserStore.getState().setPayment;
    //          function: 핀모달 여는 함수         //
    const pinModalOpen = () => {
        setWhiteModal('핀');
        openModal();
    }
    //          function: 현금 결제 사용자              //
    const cashPayment = () => {
        setPayment('현금결제')
    }

















    //              state: 웹소켓 매니저 상태               //
    const { manager } = useWebSocketStore.getState();

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 초기 사용자 상호작용을 통해 Audio 객체 생성
    const enableAudio = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            console.log('Audio object initialized.');
        }
    };

    // 주문 음성 듣기 함수
    const actionTTS = (orderId: number) => {
        fetch(`${TEST_DOMAIN}/api/v1/order/${orderId}/audio`, {
            method: 'GET',
            headers: {
                'Content-Type': 'audio/wav',
            },
            mode: 'cors', // CORS 모드 설정
        })
            .then((response) => response.blob())
            .then((audioBlob) => {
                if (audioRef.current) {
                    const audioUrl = URL.createObjectURL(audioBlob);
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
    };

    // 사용자 주문 웹소켓 구독 핸들러
    const OrderTTSSubscribe = () => {
        manager?.subscribe('/receive/user/orderTTS', (orderId: number) => {
            console.log(orderId);
            actionTTS(orderId);
        });
    };

    useEffect(() => {
        // 웹소켓 구독 설정
        OrderTTSSubscribe();

        // 컴포넌트 언마운트 시 클린업
        return () => {
            if (audioRef.current) {
                audioRef.current.src = '';
                audioRef.current = null;
            }
        };
    }, []);

















    //          render: 결제 방식 박스 렌더링             //
    return (
        <PaymentMethodBoxE onClick={enableAudio}>
            <Title>결제 방식</Title>
            <Divider />
            <Buttons>
                <CashButton onClick={cashPayment}>현금 결제</CashButton>
                <PointButton onClick={pinModalOpen}>포인트 결제</PointButton>
            </Buttons>
        </PaymentMethodBoxE>
    )
}
export default memo(PaymentMethodBox);



const PaymentMethodBoxE = styled.div`

    margin-top: 100px;


    display: flex;
    flex-direction: column;
    width: 480px;
    padding: 26px;
    box-sizing: border-box;
    gap: 12px;
    border: 14px solid var(--goldenOrange);
    border-radius: 32px;
    background-color: #FFF;
`

const Title = styled.div`
    font-size: 32px;
    color: var(--copperBrown);
`


const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32px;
    gap: 32px;
`

const CashButton = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    border-radius: 12px;
    background-color: var(--goldenOrange);
`


const PointButton = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    border-radius: 12px;
    background-color: var(--orange);
`
