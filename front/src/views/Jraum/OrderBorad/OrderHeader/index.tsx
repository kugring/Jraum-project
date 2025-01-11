import React, { useEffect, useState, useRef } from 'react';
import { TEST_DOMAIN } from 'constant';
import useWebSocketStore from 'store/web-socket.store';
import usePointChargeStore from 'store/modal/point-charge-modal.store';

const WebSocket = () => {
    const { initialize, connect, disconnect } = useWebSocketStore();
    const wsUrl = TEST_DOMAIN + '/ws'; 
    const connected = useWebSocketStore(state => state.connected);
    const { manager } = useWebSocketStore.getState();
    
    const [audioReady, setAudioReady] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 오디오 준비 상태 관리 및 음성 재생 함수
    const actionTTS = (orderId: number) => {
        if (!audioRef.current) {
            console.error('Audio reference is not initialized.');
            return;
        }

        fetch(`${TEST_DOMAIN}/api/v1/order/${orderId}/audio`)
            .then((response) => response.blob())
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
    };

    const OrderTTSSubscribe = () => {
        manager?.subscribe('/receive/user/orderTTS', (orderId: number) => {
            console.log(orderId);
            actionTTS(orderId);
        });
    };

    useEffect(() => {
        initialize(wsUrl);
        connect();
        return () => { disconnect(); };
    }, [initialize, connect, disconnect]);

    useEffect(() => {
        if (connected) {
            OrderTTSSubscribe();
        }
    }, [connected]);

    useEffect(() => {
        // 오디오 객체 초기화
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        
        audioRef.current.oncanplaythrough = () => {
            setAudioReady(true);
            console.log('Audio is ready');
        };

        audioRef.current.onerror = (error) => {
            console.error('Audio loading error:', error);
        };

    }, []);

    return <></>;
};

export default WebSocket;
