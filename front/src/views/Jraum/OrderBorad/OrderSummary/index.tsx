import { formattedPoint } from 'constant';
import useOrderStore from 'store/modal/order-list.store'
import styled from 'styled-components'

//          component: 주문 요약 컴포넌트           //
const OrderSummary = () => {

    //          render: 주문 요약 렌더링            //
    return (
        <Summary>
            <TotalQuantity>
                <Quantity />
            </TotalQuantity>
            <Divider />
            <TotalPrice>
                <Price />
            </TotalPrice>
        </Summary>
    )
}


//          component: 주문 리스트의 총합 개수 컴포넌트             //
const Quantity = () => {



    //          state: 주문 음료 총 갯수 상태           //
    const totalQuantity = useOrderStore(state => state.orderList).map(item => item.quantity).reduce((acc, quantity) => acc + quantity, 0);
    //          render: 주문 리스트의 총합 개수 렌더링            //
    return (
        <>
            {`${totalQuantity} 잔`}
        </>
    )
}


//          component: 주문 리스트의 총합 가격 컴포넌트             //
const Price = () => {
    //          state: 주문 총액 상태           //
    const totalPrice = useOrderStore(state => state.getTotalPrice())
    //          state: 주문 음료 총 갯수 상태           //
    const totalQuantity = useOrderStore(state => state.orderList).map(item => item.quantity).reduce((acc, quantity) => acc + quantity, 0);
    //          render: 주문 리스트의 총합 가격 렌더링            //
    return (
        <>
            {totalQuantity < 1 ?
                <>
                    <div style={{fontSize: 20}}>주문 부탁드립니다^^</div>
                </>
                :
                <>
                    합계: {formattedPoint(totalPrice)}원

                </>
            }
        </>

    )
}

export default OrderSummary


const Summary = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    border-radius: 10px;
    padding: 10px 0;
    margin: 0 2px;
    color: var(--copperBrown);
    background: #FFF;
    box-shadow: 0px 0px 8px 0px var(--mochaBrown);
`
const TotalQuantity = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`
const TotalPrice = styled.div`
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Divider = styled.div`
    border-right: 2.5px dotted var(--copperBrown);
`