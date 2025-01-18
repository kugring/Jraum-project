import { memo } from 'react';
import styled from 'styled-components'
import useBlackModalStore from 'store/modal/black-modal.store'

//              component: 경고창 모달 컴포넌트                 //
const AlertModal = () => {
    
    //              state: 메세지 함수                  //
    const message = useBlackModalStore.getState().message;

    //              function: 블랙 모달을 닫는 함수                  //
    const closeModal = useBlackModalStore.getState().closeModal;
    //              function: 실행할 콜백 함수                  //
    const executeCallback = useBlackModalStore.getState().executeCallback;

    //              render: 경고창 모달 렌더링                 //
    return (
        <AlertBox>
            <Message>{message}</Message>
            <Buttons>
                <Cancel onClick={() => closeModal()}>취소</Cancel>
                <CheckOK onClick={() => {executeCallback(); closeModal()}}>확인</CheckOK>
            </Buttons>
        </AlertBox>
    )
}

export default memo(AlertModal);


const AlertBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 24px 16px 12px 16px;
    box-sizing: border-box;
    border-radius: 12px;
    border: 6px solid var(--goldenOrange);
    background: var(--seashell);
`

const Message = styled.div`
    color: var(--amberBrown);
    font-size: 24px;
    word-break: break-word; 
    overflow-wrap: break-word; 
`

const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 42px;
    color: #FFF;
    gap: 12px;
    font-size: 20px;
`

const CheckOK = styled.div`
    flex: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    border: 4px solid var(--coralPink);
    background: var(--orange);
`

const Cancel = styled.div`
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    border: 4px solid var(--goldenOrange);
    background: var(--goldenSun);
`
