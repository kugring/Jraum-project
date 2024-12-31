import styled from 'styled-components'
import useOrderItemStore from 'store/modal/order-list-item.store';
import { FaPlus, FaMinus } from "react-icons/fa";
import { memo } from 'react'

//          component: 메뉴 수량 박스 컴포넌트          //
const QuantityBox = () => {

    //          state: 메뉴 수량의 증가 전역변수         //
    const incMQty = useOrderItemStore(state => state.incMQty)

    //          render: 메뉴 수량 박스 렌더링           //
    return (
        <Container>
            <Minus />
            <Quantity>
                <QuantityNum />
            </Quantity>
            <Plus size={26} color="#FFF" onClick={incMQty} />
        </Container>
    )
}
export default memo(QuantityBox);

//          component: 메뉴 수량 컴포넌트          //
const QuantityNum = () => {

    //          state: 메뉴 수량의 전역변수         //
    const orderQuantity = useOrderItemStore((state) => state.orderItem.quantity);

    //          render: 메뉴 수량 렌더링            //
    return (
        <>
            {orderQuantity}
        </>
    );
};

//          component: 마이너스 버튼 컴포넌트           //
const Minus = () => {

    //          state: 메뉴 수량의 전역변수         //
    const isPositive = useOrderItemStore((state) => state.orderItem.quantity > 1);
    //          state: 메뉴 수량의 감소 전역변수         //
    const decMQty = useOrderItemStore(state => state.decMQty)

    //          render: 마이너스 버튼 렌더링           //
    return (
        <MinusE size={26} color={isPositive ? "#FFF" : "var(--lightCream)"} style={{ opacity: isPositive ? "1" : "0.6" }} onClick={decMQty} />
    )

}

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 172px;
    padding: 3px;
    border-radius: 8px;
    box-sizing: border-box;
    border: 3px solid var(--lightBrown);
    background: #FFF;
`

const MinusE = styled(FaMinus)`
    padding: 8px;
    border-radius: 4px;
    background-color: var(--goldenPeach);
`

const Quantity = styled.div`
    flex: 1;
    text-align: center;
    font-size: 34px;
    color: var(--copperBrown);
`

const Plus = styled(FaPlus)`
    padding: 8px;
    border-radius: 4px;
    background-color: var(--goldenPeach);
`