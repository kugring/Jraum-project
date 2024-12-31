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
      <Plus size={24} color="#FFF" onClick={() => incOpQty(option.optionId)} />
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
      <MinusE size={26} color='#FFF' $active={isPositive} style={{ opacity: isPositive ? "1" : "0.6" }} onClick={() => decOpQty(option.optionId)} />
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
  justify-content: space-between;
  height: 72px;
  border-bottom: 1px solid var(--pinkBeige);
  &:last-child {
    border-bottom: none;
  }
`

const Info = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 38px;
  width: 380px;
`

const Label = styled.div`
    display: flex;
    padding-left: 36px;
    align-items: center;
    width: 140px;
    box-sizing: border-box;
    font-size: 32px;
    color: var(--brickOrange);
`

const Price = styled.div`
    font-size: 26px;
    color: var(--copperBrown);
`


const CounterE = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 132px;
    padding-right: 12px;
    border-radius: 8px;
    box-sizing: border-box;
`


const MinusE = styled(FaMinus) <{ $active: boolean }>`
    padding: 4px;
    border-radius: 4px;
    background-color: var(--coralOrange);
    opacity: ${props => props.$active ? "1" : "0.6"};
`

const Quantity = styled.div`
    flex: 1;
    text-align: center;
    font-size: 30px;
    color: var(--copperBrown);
`

const Plus = styled(FaPlus)`
    padding: 4px;
    border-radius: 4px;
    background-color: var(--coralOrange);
`