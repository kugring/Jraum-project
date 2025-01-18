import React from 'react'
import { IoClose } from 'react-icons/io5'
import styled from 'styled-components'
import NumberBoard from './NumberBoard'
import Value from './Value'
import MessageBox from './MessageBox'

//          component: 관리자 핀 체크 컴포넌트              //
const PinCheck = () => {


    //          render: 관리자 핀 체크 렌더링              //
    return (
        <PinCheckE>
            <Header>
                <Title>관리자 번호</Title>
                <Close size={42} color='#FFF'></Close>
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
            <Prevent/>
        </PinCheckE>
    )
}

export default PinCheck

const PinCheckE = styled.div`
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
`

const Prevent = styled.div`
    position: absolute;
    inset: 0; /* top: 0; right: 0; bottom: 0; left: 0; 와 동일 */
    width: 200vw;
    height: 200vh;
    transform: translate(-50%, -50%);
    
    z-index: -1; /* 다른 요소 위에 나타나도록 z-index 설정 */
`

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
  gap: 12px;
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


