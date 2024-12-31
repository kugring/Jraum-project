import styled from 'styled-components'
import { memo } from 'react';
import QuantityBox from './QuantityBox';
import useOrderItemStore from 'store/modal/order-list-item.store';
import { formattedPoint } from 'constant';



//      component: 메뉴 정보 박스 컴포넌트        //
const MenuInfoBox = () => {

  //      state: 메뉴 이름     //
  const menuName = useOrderItemStore(state => state.orderItem.menuInfo?.name);

  //      render: 메뉴 정보 박스 렌더링       //
  return (
    <InfoBox>
      <MenuName>{menuName}</MenuName>
      <MenuCount>
        <MenuPrice>
          <Price />
        </MenuPrice>
        <QuantityBox />
      </MenuCount>
    </InfoBox>
  )
};
export default memo(MenuInfoBox);

//        component: 메뉴 가격 컴포넌트         //
const Price = memo(() => {

  const totalPrice = useOrderItemStore(state => state.getTotalPrice());

  // render: 메뉴 가격 렌더링
  return (
    <>
      {formattedPoint(totalPrice)}원
    </>
  );
});


const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 376px;
  padding: 32px 0 12px 0;
`

const MenuName = styled.div`
  font-size: 40px;
  color: var(--brickOrange);
`

const MenuCount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 4px;
`

const MenuPrice = styled.div`
    font-size: 36px;
    color: var(--copperBrown);
`
