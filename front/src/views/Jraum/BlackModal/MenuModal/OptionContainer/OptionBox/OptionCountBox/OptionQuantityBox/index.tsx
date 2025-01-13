import { formattedPoint } from 'constant';
import { FaMinus, FaPlus } from 'react-icons/fa';
import useOrderItemStore from 'store/modal/order-list-item.store';
import styled from 'styled-components';
import { OptionListItem } from 'types/interface';

//          interface: 옵션 카운트 프롭스          //
interface OptionQuantityProps {
  option: OptionListItem;
}

//        component: 옵션 수량 박스 컴포넌트        //
const OptionQuantityBox = ({ option }: OptionQuantityProps) => {

  //      render: 옵션 수량 박스 렌더링         //
  return (
    <QuantityBox>
      <Label>{option.detail}</Label>
      <Info>
        <Price>
          <OptionPrice option={option} />
        </Price>
        <Counter option={option} />
      </Info>
    </QuantityBox>
  )
}
export default OptionQuantityBox


//      component: 옵션 카운트 박스 컴포넌트        //
const Counter = ({ option }: { option: OptionListItem }) => {
  //        state: 주문 옵션들 상태         //
  const incOpQty = useOrderItemStore((state) => state.incOpQty);
  //      render: 옵션 카운트 박스 렌더링        //
  return (
    <CounterE>
      <Minus option={option} />
      <Quantity>
        <QuantityNum option={option} />
      </Quantity>
      <Plus color="#FFF" onClick={() => incOpQty(option.optionId)} />
    </CounterE>
  )
}



//      component: 옵션 수량 컴포넌트        //
const QuantityNum = ({ option }: { option: OptionListItem }) => {

  //        state: 주문 옵션들 상태         //
  const optionQuantity = useOrderItemStore((state) => state.orderItem.options.filter((orderOption) => orderOption.optionId === option.optionId)[0]?.quantity ?? 0)

  //      render: 옵션 수량 렌더링        //
  return (
    <>
      {optionQuantity}
    </>
  );
};

//          component: 마이너스 버튼 컴포넌트           //
const Minus = ({ option }: { option: OptionListItem }) => {

  //          state: 옵션 수량의 전역변수         //
  const isPositive = useOrderItemStore((state) => state.orderItem.options.filter((orderOption) => orderOption.optionId === option.optionId)[0]?.quantity > 0)
  //          state: 옵션 수량의 감소 전역변수         //
  const decOpQty = useOrderItemStore((state) => state.decOpQty);

  //          render: 마이너스 버튼 렌더링           //
  return (
      <MinusE color='#FFF' $active={isPositive} style={{ opacity: isPositive ? "1" : "0.6" }} onClick={() => decOpQty(option.optionId)} />
  )

}


//      component: 옵션 가격 컴포넌트         //
const OptionPrice = ({ option }: { option: OptionListItem }) => {

  //        state: 주문 옵션 수량 상태         //
  const optionQuantity = useOrderItemStore((state) => state.orderItem.options.filter((orderOption) => orderOption.optionId === option.optionId)[0]?.quantity ?? 0)

  //        render: 옵션 가격 렌더링         //
  return (
    <>
      {formattedPoint(optionQuantity * option.price)}원
    </>
  )
}


const QuantityBox = styled.div`
  display: flex;
  height: 72px;
  border-bottom: 1px solid var(--pinkBeige);
  &:last-child {
    border-bottom: none;
  }
    
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
  gap: 16px;
  height: 60px;
  }
`


const Label = styled.div`
    display: flex;
    align-items: center;
    width: 140px;
    padding-left: 36px;
    box-sizing: border-box;
    font-size: 32px;
    color: var(--brickOrange);
    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
    padding-left: 14px;
    width: 88px;
    font-size: 20px;
    }
`

const Info = styled.div`
  flex: 1;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 38px;
  width: 380px;
  
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
  width: auto;
  gap: 16px;
}
`

const Price = styled.div`
    font-size: 26px;
    color: var(--copperBrown);
  
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
    font-size: 16px;
}
`


const CounterE = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 132px;
    padding-right: 12px;
    border-radius: 8px;
    box-sizing: border-box;
  
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
    width: 68px;
    padding-right: 4px;
}
`


const MinusE = styled(FaMinus) <{ $active: boolean }>`
    font-size: 26px;
    padding: 4px;
    border-radius: 4px;
    background-color: var(--coralOrange);
    opacity: ${props => props.$active ? "1" : "0.6"};
  
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 2px;
    border-radius: 2px;
}
`

const Quantity = styled.div`
    flex: 1;
    text-align: center;
    font-size: 30px;
    color: var(--copperBrown);
  
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
    font-size: 16px;
}
`

const Plus = styled(FaPlus)`
    font-size: 24px;
    padding: 5px;
    border-radius: 4px;
    background-color: var(--coralOrange);
  
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 2px;
    border-radius: 2px;
}
`