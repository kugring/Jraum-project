import { memo } from 'react'
import useOrderItemStore from 'store/modal/order-list-item.store';
import styled from 'styled-components'


//          component: 모달 메뉴 이미지 컴포넌트            //
const MenuImage = () => {

  //      state: 메뉴 이미지     //
  const menuImage = useOrderItemStore(state => state.orderItem.menuInfo?.image);
  //      state: 메뉴 온도     //
  const menuTem = useOrderItemStore(state => state.orderItem.menuInfo?.temperature!);
    

    //          render: 메뉴 모달 이미지 런데링         //
    return (
        <>
            <Image src={menuImage} />
            <Temperature>{menuTem}</Temperature>
        </>
    )
}
export default memo(MenuImage); 

const Image = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 15px;
  background: lightgray 50% / cover no-repeat;
  
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
      width: 100px;
      height: 100px;
      border-radius: 6px;
    }
`

const Temperature = styled.div`
    position: absolute;
    top:12px;
    left: 12px;
    align-self: baseline;
    padding: 2px 4px;
    font-size: 16px;
    border-radius: 4px;
    color: #fff;
    background-color: ${(props) => (props.children === "HOT" ? "#E7727A " : "#5C76D1")};
  
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
    top: 6px;
    left: 6px;    
    padding: 2px;
    font-size: 8px;
    border-radius: 2px;
  }
`;