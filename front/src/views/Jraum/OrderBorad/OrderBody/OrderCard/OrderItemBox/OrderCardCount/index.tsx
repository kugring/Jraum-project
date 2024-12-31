import styled from 'styled-components';
import useOrderStore from 'store/modal/order-list.store';
import { useEffect } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { OrderOption } from 'types/interface';

//          interface: 주문 카드 카운트 프롭스           //
interface OrderCardCountProps {
    menuId: number;
    options: OrderOption[];
}

//          component: 주문 카드 카운트 컴포넌트            //
const OrderCardCount = ({ menuId, options }: OrderCardCountProps) => {


    //          function: 메뉴 수량을 증가시키는 함수 (전역함수)           //
    const incMQty = useOrderStore.getState().incMQty;
    //          function: 메뉴 수량을 감소시키는 함수 (전역함수)           //
    const decMQty = useOrderStore.getState().decMQty;


    //          render: 주문 카드 카운트 렌더링             //
    return (
        <Counter>
            <Minus size={16} color="var(--copperBrown)" onClick={() => decMQty(menuId, options)} />
            <Quantity>
                <CountQunatity menuId={menuId} options={options} />
            </Quantity>
            <Plus size={16} color="var(--copperBrown)" onClick={() => incMQty(menuId, options)} />
        </Counter>
    )
}
export default OrderCardCount


//          interface: 주문 카드 카운트 프롭스           //
interface CountQunatityProps {
    menuId: number;
    options: OrderOption[];
}

//          component: 카운트 숫자 컴포넌트           //
const CountQunatity = ({ menuId, options }: CountQunatityProps) => {

    //          state: 메뉴 수량           //
    const quantity = useOrderStore(state => state.getQuantity(menuId, options));

    //          effect: 수량 0이 되는 경우 주문 아이템 삭제             //
    useEffect(() => {
        if (quantity === 0) {
            useOrderStore.getState().removeOrderItem(menuId, options)
        }
    }, [menuId, options, quantity]);

    //          render: 카운트 숫자 렌더링          //
    return (
        <>
            {quantity}
        </>
    )
}


const Counter = styled.div`
    display: flex;
    width: 80px;
    height: 26px;
    justify-content: space-between;
    align-items: center;

    border-radius: 4px;
    border: 1px solid var(--pinkBeige);
    background: #FFF;
`


const Minus = styled(FaMinus)`
    padding: 6px;
`

const Quantity = styled.div`
    flex: 1;
    text-align: center;
    font-size: 18px;
    color: var(--brickOrange);
`

const Plus = styled(FaPlus)`
    padding: 6px;
`