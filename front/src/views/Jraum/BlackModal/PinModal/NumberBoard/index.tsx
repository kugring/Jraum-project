import styled from 'styled-components';
import usePinUserStore from 'store/pin-user.store';
import { GrPowerReset } from "react-icons/gr";
import { FaDeleteLeft } from "react-icons/fa6";

//      component: 숫자 번호판 컴포넌트       //
const NumberBoard = () => {


    //          function: 핀 번호 추가하는 함수         //
    const pushPin = usePinUserStore.getState().pushPin;
    //          function: 핀 번호 리셋하는 함수         //
    const setPin = usePinUserStore.getState().setPin;
    //          function: 핀 번호 마지막 문자 1개 지워주는 함수         //
    const popPin = usePinUserStore.getState().popPin;

    //       render: 숫자 번호판 렌더링         //
    return (
        <NumberBoardE>
            <NumberButton onClick={() => pushPin("1")}>{1}</NumberButton>
            <NumberButton onClick={() => pushPin("2")}>{2}</NumberButton>
            <NumberButton onClick={() => pushPin("3")}>{3}</NumberButton>
            <NumberButton onClick={() => pushPin("4")}>{4}</NumberButton>
            <NumberButton onClick={() => pushPin("5")}>{5}</NumberButton>
            <NumberButton onClick={() => pushPin("6")}>{6}</NumberButton>
            <NumberButton onClick={() => pushPin("7")}>{7}</NumberButton>
            <NumberButton onClick={() => pushPin("8")}>{8}</NumberButton>
            <NumberButton onClick={() => pushPin("9")}>{9}</NumberButton>
            <Reset color='var(--copperOrange)' onClick={() => setPin('')} />
            <NumberButton onClick={() => pushPin("0")}>{0}</NumberButton>
            <Delete color='var(--copperOrange)' onClick={popPin} />
        </NumberBoardE>
    )
}

export default NumberBoard

const NumberBoardE = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 42px;
  width: 100%;
`;

const NumberButton = styled.div`
  padding: 14px 0;
  text-align: center;
  font-size: 36px;
  border-radius: 5px;
  cursor: pointer;
  color: var(--copperOrange);
`;

const Reset = styled(GrPowerReset)`
  padding: 14px 0;
  width: 100%;
  font-size: 36px;
  border-radius: 5px;
  cursor: pointer;
`;

const Delete = styled(FaDeleteLeft)`
  padding: 14px 0;
  width: 100%;
  font-size: 36px;
  border-radius: 5px;
  cursor: pointer;
  transform: translateX(-6px);
  
`;
