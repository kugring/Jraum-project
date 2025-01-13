import styled from 'styled-components';
import { IoClose } from "react-icons/io5";
import { memo } from 'react';
import NumberBoard from './NumberBoard';
import MessageBox from './MessageBox';
import useBlackModalStore from 'store/modal/black-modal.store';
import usePinUserStore from 'store/pin-user.store';
import Value from './Value';

//          component: 핀 번호 모달 컴포넌트             //
const PinModal = () => {

  //        function: 블랙 모달 종료 함수         //
  const closeModal = useBlackModalStore.getState().closeModal;
  //        function: 핀 수정하는 함수          //
  const setPin = usePinUserStore.getState().setPin;
  //        function: 핀 모달 닫기 함수       //
  const pinModalClose = () => {
    closeModal()
    setTimeout(() => setPin(''), 510) // 블랙 모달 닫히고 초기화하여 렌더링을 막는다.
  }

  //          render: 핀 모달 렌더링          //
  return (
    <PinModalE>
      <Header>
        <Title>회원번호</Title>
        <Close size={42} color='#FFF' onClick={pinModalClose}></Close>
      </Header>
      <svg width="100%" height="5"> <line x1="0" y1="5" x2="100%" y2="5" stroke="var(--copperOrange)" strokeWidth="4" strokeDasharray="12, 10" strokeLinecap="round" /> </svg>
      <Body>
        <InputValueBox>
          {[...Array(4)].map((_, i) => (
            <InputValue key={i}>
              <Value index={i} />
            </InputValue>
          ))}
        </InputValueBox>
        <MessageBox />
        <svg width="100%" height="5"> <line x1="0" y1="5" x2="100%" y2="5" stroke="var(--copperOrange)" strokeWidth="4" strokeDasharray="12, 10" strokeLinecap="round" /> </svg>
        <NumberBoard />
      </Body>
    </PinModalE>
  );
};

export default memo(PinModal);

const PinModalE = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 340px;
    width: 340px;
    padding: 28px 28px 12px;
    gap: 12px;
    border: 12px solid var(--goldenOrange);
    box-sizing: border-box;
    border-radius: 26px;
    background-color: var(--seashell);
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.div`
  font-size: 42px;
  color: var(--brickOrange);
`;
const Close = styled(IoClose)`
  border-radius: 6px;
  background-color: var(--coralPink);
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
`;

const InputValueBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 14px;
`;


const InputValue = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
    font-size: 38px;
  aspect-ratio: 1 / 1;
  color: var(--copperOrange);
  border-radius: 10px;
  border: 4px solid var(--goldenOrange);
  background: #FFF;
  
`;



