import useBlackModalStore from 'store/modal/black-modal.store';
import useOrderStore from 'store/modal/order-list.store';
import usePinUserStore from 'store/pin-user.store';
import styled from 'styled-components'

//        component: 주문 결제 버튼 컴포넌트          //
const OrderPayButton = () => {

	//          state: 주문 음료 총 갯수 상태           //
	const existedOrder = useOrderStore(state => state.getOrderListLength() > 0);
	//			state: 결제 방식 상태			//
	const payment = usePinUserStore(state => state.payment);

	//			function: 블랙 모달 여는 함수				//
	const openModal = useBlackModalStore.getState().openModal
	//			functionL 화이트 모달 설정 함수				//
	const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
	//          function: 결제 모달 여는 함수             //
	const payModalOpen = () => {
		if(existedOrder){
			console.log(payment);
			
			openModal();
			if(payment === '포인트결제'){
				setWhiteModal('포인트결제');
			} else if (payment === '현금결제') {
				setWhiteModal('현금결제');
			} 
			return;
		}
	}


	//        render: 주문 결제 버튼 렌더링         //
	return (
		<PayButton $exist={existedOrder} onClick={payModalOpen}>
			{'결제하기'}
		</PayButton>
	)
}

export default OrderPayButton

const PayButton = styled.div<{ $exist: boolean }>`
  padding: 20px 4px;
  text-align: center;
  font-size: 42px;
  border-radius: 14px;
  color: ${({ $exist }) => $exist ? "#FFF" : "var(--lightBrown)"} ; 
  border: 4px solid ${({ $exist }) => $exist ? "var(--redOrange)" : "var(--lightBrown)"} ; 
  background-color: ${({ $exist }) => $exist ? "var(--orange)" : "var(--creamyYellow)"} ;

  transition: background 300ms;
`
