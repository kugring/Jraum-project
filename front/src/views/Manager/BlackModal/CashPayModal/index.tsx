import { formattedPoint } from 'constant';
import React from 'react'
import useManagerStore from 'store/manager/manager.store'
import useBlackModalStore from 'store/modal/black-modal.store';
import useWebSocketStore from 'store/web-socket.store';
import styled from 'styled-components';

//          component: 현금 결제 모달창 컴포넌트                //
const CashPayModal = () => {

    //          state: 현금 결제 금액 상태                //
    const cashPrice = useManagerStore(state => state.cashPrice);

    //          function: 현금 결제 대기중 설정 함수                //
    const setCashPayWaiting = useManagerStore(state => state.setCashPayWaiting);

    //          function: 현금 결제 응답하는 함수            //
    const handleCashPayOk = (cashPayOk: boolean): void => {
        const { manager } = useWebSocketStore.getState();
        manager?.sendMessage('/send/cashPayOk', { cashPayOk: cashPayOk }); // 메시지 전송
        setCashPayWaiting(false);
        closeModal();
    };
    //          function: 블랙모달 열고 닫는 함수               //
    const closeModal = useBlackModalStore.getState().closeModal;

    //          render: 현금 결제 모달창 렌더링             //
    return (
        <AlertBox>
            <Price>{`${formattedPoint(cashPrice)}원`}</Price>
            <Buttons>
                <Cancel onClick={() => handleCashPayOk(false)}>취소</Cancel>
                <CashOk onClick={() => handleCashPayOk(true)}>결제완료</CashOk>
            </Buttons>
        </AlertBox>
    )
}

export default CashPayModal


const AlertBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 260px;
    gap: 20px;
    padding: 24px 16px 12px 16px;
    box-sizing: border-box;
    border-radius: 20px;
    border: 8px solid var(--goldenOrange);
    background: var(--seashell);
`

const Price = styled.div`
    color: var(--amberBrown);
    font-size: 32px;
`

const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 42px;
    color: #FFF;
    gap: 12px;
    font-size: 24px;
`

const CashOk = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    border: 4px solid var(--coralPink);
    background: var(--orange);
`

const Cancel = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 62px;
    border-radius: 6px;
    border: 4px solid var(--goldenOrange);
    background: var(--goldenSun);
`
