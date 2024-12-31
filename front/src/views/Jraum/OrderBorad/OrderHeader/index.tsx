import styled from 'styled-components'
import { FaTrash } from 'react-icons/fa'
import useOrderStore from 'store/modal/order-list.store'

//              component: 주문 헤더 컴포넌트               //
const OrderHeader = () => {

    //          function: 주문 리스트 리셋하는 함수 (전역함수)            //
    const setOrderList = useOrderStore(state => state.setOrderList)


    //              render: 주문 헤더 렌더링               //
    return (
        <Header>
            {'장바구니'}
            <OrderResetButton onClick={() => setOrderList([])}>
                {'삭제'}
                <FaTrash size={24} color={"var(--copperRed)"} /> {/* 아이콘 크기와 색상 조정 가능 */}
            </OrderResetButton>
        </Header>
    )
}
export default OrderHeader


const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
    font-size:32px;
    color: var(--copperRed);
`

const OrderResetButton = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    gap: 4px;

    width: fit-content;
    padding: 5px 15px;

    font-size: 18px;

    border-radius: 10px;
    border: 5px solid var(--copperRed);
    background-color: var(--lightCream);
`