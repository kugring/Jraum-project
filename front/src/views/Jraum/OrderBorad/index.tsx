import styled from 'styled-components';
import OrderHeader from './OrderHeader';
import OrderSummary from './OrderSummary';
import OrderPayButton from './OrderPayButton';
import OrderBody from './OrderBody';
import { useState } from 'react';
import { useOrderStore } from 'store/modal';
import { FaAngleDown } from "react-icons/fa6";

//              component: 주문 보드 컴포넌트             //
const OrderBoard = () => {

    //              state: 주문 음료 총 갯수 상태           //
    const totalQuantity = useOrderStore(state => state.orderList).map(item => item.quantity).reduce((acc, quantity) => acc + quantity, 0);

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startY, setStartY] = useState<number>(0);
    const [translateY, setTranslateY] = useState<number>(0); // 드래그로 이동한 위치
    const [isHidden, setIsHidden] = useState<boolean>(true); // 숨김 상태

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent): void => {
        e.preventDefault(); // 기본 동작 방지
        setIsDragging(true);
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        setStartY(clientY);
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent): void => {
        e.preventDefault(); // 기본 동작 방지
        if (!isDragging) return;

        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - startY;

        if (deltaY > 20) { // 특정 드래그 거리 이상일 때만 동작
            const newTranslateY = translateY + deltaY;
            if (newTranslateY >= 0) {
                setTranslateY(newTranslateY);
                setStartY(clientY);
            }
        }
    };

    const handleDragEnd = (): void => {
        if (!isDragging) return;
        setIsDragging(false);

        const threshold = window.innerHeight * 0.1; // 화면의 10% 기준
        if (translateY > threshold) {
            setTranslateY(window.innerHeight); // 숨기기
            setIsHidden(true);
        } else {
            setTranslateY(0); // 원래 위치로 되돌리기
            setIsHidden(false);
        }
    };

    const handleShowBoard = (): void => {
        setTranslateY(0);
        setIsHidden(false);
    };

    //              render: 주문 보드 렌더링             //
    return (
        <>
            <Board
                $isHidden={isHidden}
                $translateY={translateY}
                $isDragging={isDragging}
            >
                <DragBar
                    onClick={() => setIsHidden(true)}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onMouseMove={handleDragMove}
                    onTouchMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onTouchEnd={handleDragEnd}
                />
                <OrderHeader />
                <OrderBody />
                <OrderFooter>
                    <OrderSummary />
                    <OrderPayButton />
                </OrderFooter>
            </Board>
            <ShowButton $isHidden={!isHidden} onClick={handleShowBoard}>
                ⬆️ 장바구니 {totalQuantity}개
            </ShowButton>
        </>
    );
};

export default OrderBoard;

const Board = styled.div<{ $isHidden: boolean, $translateY: number, $isDragging: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    min-width: 360px;
    height: 100%;
    box-sizing: border-box;
    padding: 12px 16px 20px;
    background-color: var(--creamyYellow);

    @media (max-width: 768px) {
        position: absolute;
        bottom: 0;
        display: ${({ $isHidden }) => $isHidden ? "none" : "flex"};
        width: calc(100% - 8px);
        min-width: 0;
        height: 45%;
        margin: 0 4px;
        border-radius: 24px 24px 0 0;
        border-top: 4px solid var(--coralBrown);
        border-right: 4px solid var(--coralBrown);
        border-left: 4px solid var(--coralBrown);
        border-bottom: 0;
        transform: translateY(${(props) => props.$translateY}px);
        transition: ${(props) => (props.$isDragging ? "none" : "transform 0.3s ease")};
    }
`;

const DragBar = styled(FaAngleDown)`
    display: none;

    @media (max-width: 768px) {
    display: flex;
    width: 100%;
    font-size: 16px;
    color: var(--antiqueCream);
    transform: scaleX(2); /* x축으로 두 배 늘림 */
    cursor: grab; /* 드래그 커서 */
    }
`;

const OrderFooter = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;

    @media (max-width: 768px) {
        flex-direction: row;
    }
`;

const ShowButton = styled.button<{$isHidden: boolean}>`
    display: none;

    @media (max-width: 768px) {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: ${({ $isHidden }) => $isHidden ? "none" : "flex"};
    padding: 12px 24px;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    background-color: var(--coralOrange);
    }
`;