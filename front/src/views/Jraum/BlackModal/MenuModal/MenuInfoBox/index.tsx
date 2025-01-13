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
  justify-content: center;
  width: 376px;
  gap:12px;
  padding-top: 24px;
  
  
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
    flex: 1;
    width: auto;
    gap: 4px;
    padding-top: 12px;
  }
`

const MenuName = styled.div`
  font-size: 40px;
  color: var(--brickOrange);
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
  font-size: 22px;
  }
`

const MenuCount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 4px;
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
  padding: 0;
  }
`

const MenuPrice = styled.div`
    font-size: 36px;
    color: var(--copperBrown);
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
    font-size: 18px;
    }
`
