import styled from 'styled-components';
import OrderHeader from './OrderHeader';
import OrderSummary from './OrderSummary';
import OrderPayButton from './OrderPayButton';
import OrderBody from './OrderBody';

//          component: 주문 보드 컴포넌트             //
const OrderBoard = () => {


  //          render: 주문 보드 렌더링            //
  return (
    <Board>
      <OrderHeader />
      <OrderBody />
      <OrderSummary />
      <OrderPayButton />
    </Board>
  );
};

export default OrderBoard;

const Board = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    min-width: 360px;
    height: 100%;
    gap: 12px;
    box-sizing: border-box;
    padding: 12px 16px 20px;
    background-color: var(--creamyYellow);

    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
      display: none;
    }
`;
