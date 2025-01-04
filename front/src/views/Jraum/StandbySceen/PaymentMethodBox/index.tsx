import Divider from 'components/Divider'
import { memo } from 'react';
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

    //          render: 결제 방식 박스 렌더링             //
    return (
        <PaymentMethodBoxE>
            <Title>결제 방식</Title>
            <Divider />
            <Buttons>
                <CashButton onClick={cashPayment}>현금 결제3</CashButton>
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
