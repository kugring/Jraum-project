import styled from 'styled-components';
import OrderHeader from './OrderHeader';
import OrderSummary from './OrderSummary';
import OrderPayButton from './OrderPayButton';
import OrderBody from './OrderBody';
import { useState } from 'react';
import { useOrderStore } from 'store/modal';

//          component: 주문 보드 컴포넌트             //
const OrderBoard = () => {


    //          state: 주문 음료 총 갯수 상태           //
    const totalQuantity = useOrderStore(state => state.orderList).map(item => item.quantity).reduce((acc, quantity) => acc + quantity, 0);

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startY, setStartY] = useState<number>(0);
    const [translateY, setTranslateY] = useState<number>(0); // 드래그로 이동한 위치
    const [isHidden, setIsHidden] = useState<boolean>(false); // 숨김 상태

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent): void => {
        setIsDragging(true);
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        setStartY(clientY);
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent): void => {
        if (!isDragging) return;
    
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - startY;
        const newTranslateY = translateY + deltaY;
    
        // translateY 값이 0 미만으로 내려가지 않도록 제한
        if (newTranslateY >= 0) {
            setTranslateY(newTranslateY); // 위치 갱신
            setStartY(clientY);
        }
    };

    const handleDragEnd = (): void => {
        setIsDragging(false);

        // 위치 결정: 화면 아래로 내려가거나, 다시 올림
        const threshold = window.innerHeight * 0.2; // 화면의 40%를 기준으로
        if (translateY > threshold) {
            // 화면 아래로 숨기기
            setTranslateY(window.innerHeight);
            setIsHidden(true);
        } else {
            // 기본 위치로 되돌리기
            setTranslateY(0);
            setIsHidden(false);
        }
    };

    const handleShowBoard = (): void => {
        setTranslateY(0);
        setIsHidden(false);
    };


    //          render: 주문 보드 렌더링            //
    return (
        <>
            <Board
                isHidden={isHidden}
                translateY={translateY}
                isDragging={isDragging}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onMouseMove={handleDragMove}
                onTouchMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onTouchEnd={handleDragEnd}
            >
                <DragBar />
                <OrderHeader />
                <OrderBody />
                <OrderFooter>
                    <OrderSummary />
                    <OrderPayButton />
                </OrderFooter>
            </Board>
            <ShowButton isHidden={!isHidden} onClick={handleShowBoard}>⬆️ 장바구니 {totalQuantity}개</ShowButton>
        </>
    );
};

export default OrderBoard;

const Board = styled.div<{ isHidden: boolean, translateY: number, isDragging: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    min-width: 360px;
    height: 100%;
    gap: 12px;
    box-sizing: border-box;
    padding: 12px 16px 20px;
    background-color: var(--creamyYellow);
    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
    position: absolute;
    bottom: 0;
    display: ${({ isHidden }) => isHidden ? "none" : "flex"};
    width: calc(100% - 8px);
    min-width: 0;
    height: 50%;
    margin: 0 4px;
    border-radius: 24px 24px 0 0;
    border: 4px solid var(--coralBrown);
    transform: translateY(${(props) => props.translateY}px);
    transition: ${(props) => (props.isDragging ? "none" : "transform 0.3s ease")};
    }
`;

const DragBar = styled.div`
    display: none;
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        display: flex;
        width: 72px;
        margin: 4px 0 0 0;
        border: 2px solid var(--antiqueCream);
        border-radius: 1000px;
    }
`


const OrderFooter = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;

    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        flex-direction: row;
    }
`

const ShowButton = styled.button<{isHidden: boolean}>`
    position: fixed;
    bottom: 16px;
    left: 50%;
    display: ${({ isHidden }) => isHidden ? "none" : "flex"};
    transform: translateX(-50%);
    padding: 12px 24px;
    background-color: var(--coralBrown);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
`;