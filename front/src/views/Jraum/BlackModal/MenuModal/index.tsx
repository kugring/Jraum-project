import styled from 'styled-components';
import { memo } from 'react'
import useOrderItemStore from 'store/modal/order-list-item.store';
import useBlackModalStore from 'store/modal/black-modal.store';
import useOrderStore from 'store/modal/order-list.store';
import MenuImage from './MenuImage';
import MenuInfoBox from './MenuInfoBox';
import OptionContainer from './OptionContainer';
import { OrderListItem } from 'types/interface';

//      component: 메뉴 모달 컴포넌트       //
const MenuModal = () => {


  //        state: 주문 아이템 상태         //
  const staticOrderItem = useOrderItemStore.getState().orderItem

  //      function: 블랙 모달 전역함수     //
  const closeModal = useBlackModalStore(state => state.closeModal);
  //        function: 메뉴 모달 주문 수정 상태 처리 함수        //
  const setEdit = useOrderItemStore.getState().setEdit;
  //      function: 블랙모달이 닫히고 모달정보 리셋 처리하는 함수       //
  const resetModal = () => {
    // 원래는 OrderItem을 리셋했지만 정보가 빈 모달 출현의 버그 때문에 제거했다.
    setEdit(false);
    closeModal();
  }


  //      render:   메뉴 모달 렌더링        //
  return (
    <MenuInfoContainer>
      <ModalTop>
        <MenuImage />
        <MenuInfoBox />
      </ModalTop>
      <OptionContainer />
      <ModalBottom>
        <Close onClick={() => resetModal()} >
          {'이전'}
        </Close>
        <SaveOrder staticOrderItem={staticOrderItem} />
      </ModalBottom>
    </MenuInfoContainer>
  )
}
export default memo(MenuModal);

//        component: 주문 저장 버튼 컴포넌트          //
const SaveOrder = ({ staticOrderItem }: { staticOrderItem: OrderListItem }) => {

  //        state: 메뉴 모달 주문 수정 상태        //
  const edit = useOrderItemStore.getState().edit;

  //        function: 메뉴 모달 주문 수정 상태 처리 함수        //
  const setEdit = useOrderItemStore.getState().setEdit;
  //      function: 블랙 모달 전역함수     //
  const closeModal = useBlackModalStore(state => state.closeModal);
  //        function: 주문 아이템을 주문 리스트에 추가하는 함수         //
  const addOrderItem = useOrderStore(state => state.addOrderItem);
  //        function: 주문 아이템을 주문 리스트에 제거하는 함수         //
  const removeOrderItem = useOrderStore(state => state.removeOrderItem);
  //      function: 상황에 맞게 post, update하는 함수       //
  const saveOrderItem = () => {
    const orderItem = useOrderItemStore.getState().orderItem
    // 새로운 orderItem은 options가 비어있지만 수정되는 orderItem은 기존 옵션값들로 인해서 비어있지 않다
    if (edit) {
      removeOrderItem(staticOrderItem.menuId, staticOrderItem.options);
      setEdit(false);
    }
    // 동시에 삭제,생성이 된다면 OrderBoard에서 length를 그대로 변동없다고 인식해서
    // 삭제와 추가를 순서에 맞게 진행하면 length가 줄었다 증가하면서 인식하여 useEffect가 제대로 진행됨
    setTimeout(() => addOrderItem(orderItem), 100)
    // 주문 아이템 리셋이 모달이 종료된 이유에 진행하여 리렌더링을 막는다.
    // setTimeout(() => resetOrderItem(), 700) 리셋을 안해야 정보가 비는 오류가 안뜬다!
    closeModal();
  };
  //        render: 주문 저장 버튼 렌더링         //
  return (
    <Save onClick={saveOrderItem}>
      {'주문담기'}
    </Save>
  )
}


const MenuInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 640px;
  gap: 24px;
  padding: 20px;
  box-sizing: border-box;

  border-radius: 28px;
  border: 16px solid var(--goldenOrange);
  background: #FFF5EE;
`

const ModalTop = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`
const ModalBottom = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 24px;
    height: 80px;
`

const Close = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 160px;
    font-size: 36px;
    box-sizing: border-box;
    border-radius: 10px;
    color: #FFF;
    border: 5px solid var(--unnamed, #FC8D08);
    background: var(--unnamed, #FFC346);
`

const Save = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 380px;
    font-size: 36px;
    box-sizing: border-box;
    border-radius: 10px;
    color: #FFF;
    border: 4px solid #FF4E28;
    background: var(--unnamed, #FC8D08);
    
`