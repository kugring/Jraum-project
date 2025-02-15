import styled from 'styled-components';
import { memo } from 'react';
import isEqual from 'lodash/isEqual';
import useBlackModalStore from 'store/modal/black-modal.store';
import useOrderItemStore from 'store/modal/order-list-item.store';
import useOrderStore from 'store/modal/order-list.store';
import OrderItemBox from './OrderItemBox';
import { OrderListItem, OrderOption } from 'types/interface';

//        interface: 주문 카드 프롭스       //
interface OrderCardProps {
  tem: string;
  name: string;
  price: number;
  image: string;
  menuId: number;
  options: OrderOption[];
  staff: number;
  orderItem: OrderListItem;
}

//        component: 주문 카드 컴포넌트         //
const OrderCard = ({ name, image, price, menuId, tem, options, staff, orderItem }: OrderCardProps) => {


  //        function: 블랙모달 오픈 함수          //
  const openModal = useBlackModalStore.getState().openModal;
  //        function: 화이트 모달 설정 함수          //
  const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
  //        function: 메뉴 모달 주문 정보 set 처리 함수        //
  const setOrderItem = useOrderItemStore.getState().setOrderItem;
  //        function: 메뉴 모달 보여질 옵션 처리 함수        //
  const setShowOption = useOrderItemStore.getState().setShowOption;
  //        function: 메뉴 모달 주문 수정 상태 처리 함수        //
  const setEdit = useOrderItemStore.getState().setEdit;

  //        function: 주문 아이템 수정 모달 처리 함수       //
  const editOrderItem = () => {
    setEdit(true);
    setWhiteModal('메뉴')
    setOrderItem(orderItem)  // 일단 이놈은 갱신되지 않은 수량 1짜리이다 문제임 
    setShowOption(orderItem.menuInfo.sortedOptionCategory[0])
    setTimeout(() => openModal(), 10)
  }

  //        function: 주문 아이템 삭제 처리 함수        //
  const removeOrderItem = useOrderStore.getState().removeOrderItem

  //        render: 주문 카드 렌더링        //
  return (
    <Card>
      <OrderItemBox name={name} image={image} price={price} menuId={menuId} tem={tem} options={options} staff={staff} />
      <Buttons>
        <EditButton onClick={editOrderItem}>변경</EditButton>
        <DeleteButton onClick={() => removeOrderItem(menuId, options)}>삭제</DeleteButton>
      </Buttons>
    </Card>
  );
};

// React.memo를 사용하여 깊은 비교를 통해 불필요한 렌더링을 방지
export default memo(OrderCard, (prevProps, nextProps) => {
  // name, image, price, quantity, tem 프롭에 대해 깊은 비교
  return (
    isEqual(prevProps.menuId, nextProps.menuId)
  );
});

// 스타일드 컴포넌트
const Card = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 14px 14px 2px;
  box-sizing: border-box;
  overflow-x: scroll;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scroll-padding-left: 14px;
  scroll-snap-align: start;

  &::-webkit-scrollbar {
    display: none;
  }
    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
    padding: 10px 14px 2px;
    }
`;

const Buttons = styled.div`
  position: absolute;
  right: 0;
  transform: translateX(105%);
  display: flex;
  align-items: center;
  padding-right: 12px;
  gap: 20px;
  scroll-snap-align: start;
`;

const EditButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 40px;
  font-size: 20px;
  color: #fff;
  border-radius: 8px;
  border: 4px solid var(--orange);
  background: var(--goldenSun);
`;

const DeleteButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 40px;
  font-size: 20px;
  color: #fff;
  border-radius: 8px;
  border: 4px solid var(--coralPink);
  background: var(--coralOrange);
`;
