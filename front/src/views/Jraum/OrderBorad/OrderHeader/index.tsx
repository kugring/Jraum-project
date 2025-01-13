import styled from 'styled-components'
import { FaTrash } from 'react-icons/fa'
import useOrderStore from 'store/modal/order-list.store'
import { TEST_DOMAIN } from 'constant'

//              component: 주문 헤더 컴포넌트               //
const OrderHeader = () => {

    //          function: 주문 리스트 리셋하는 함수 (전역함수)            //
    const setOrderList = useOrderStore(state => state.setOrderList)

    //          function: 주문 음성 듣기 함수               //
    const actionTTS = (orderId: number) => {
        fetch(`${TEST_DOMAIN}/api/v1/order/${orderId}/audio`, {
            method: 'GET',
            headers: {
                'Content-Type': 'audio/wav'
            },
            mode: 'cors',  // CORS 모드 설정
        })
            .then((response) => response.blob())
            .then((audioBlob) => {
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);

                // 로그 추가: 오디오가 로드된 후
                audio.oncanplaythrough = () => {
                    console.log("Audio loaded successfully");
                    audio.play();
                };

                audio.onerror = (error) => {
                    console.error("Audio playback error:", error);
                };

                audio.play();
            })
            .catch((error) => {
                console.error("Error fetching audio:", error);
            });
        console.log("누름");
    }

    //              render: 주문 헤더 렌더링               //
    return (
        <Header onClick={() => actionTTS(1)}>
            {'장바구니'}
            <OrderResetButton onClick={() => setOrderList([])}>
                {'삭제'}
                <DeleteIcon/> {/* 아이콘 크기와 색상 조정 가능 */}
            </OrderResetButton>
        </Header>
    )
}
export default OrderHeader


const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 6px 0;
    font-size:32px;
    color: var(--copperRed);
        
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
    padding: 0;
    font-size:24px;
    }
`

const OrderResetButton = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    gap: 4px;

    width: fit-content;
    padding: 5px 15px;

    font-size: 18px;

    border-radius: 10px;
    border: 5px solid var(--copperRed);
    background-color: var(--lightCream);
        
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
    padding: 2px 6px;
    font-size:16px;
    border-radius: 6px;
    border: 3px solid var(--copperRed);
}
`

const DeleteIcon = styled(FaTrash)`
    font-size: 16px;
    color: var(--copperRed);
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
    font-size:16px;
}
`