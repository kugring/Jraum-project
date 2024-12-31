import useOrderStore from "store/modal/order-list.store";
import styled from "styled-components";
import OrderCard from "./OrderCard";
import BackgroundImage from 'assets/image/order-board-background-img.jpg'


//        component: 주문 박스 컴포넌트         //
const OrderBody = () => {

  //      state: 주문 리스트 상태       //
  const orderList = useOrderStore.getState().orderList || [];
  //      state: 주뮨 개수 상태         //
  useOrderStore((state) => state.getOrderListLength()) // 갯수가 변경되는 경우만 렌더링이 발생하는 천재적인 발상!

  //        render: 주문 박스 렌더링        //
  return (
    <Body>
      {orderList.map((orderItem, index) => (
        <OrderCard
          key={`${orderItem.menuId}-${index}`}
          name={orderItem.menuInfo?.name!}
          image={orderItem.menuInfo?.image!}
          price={orderItem.menuInfo?.price!}
          tem={orderItem.menuInfo?.temperature!}
          options={orderItem.options}
          menuId={orderItem.menuId}
          orderItem={orderItem}
        />
      ))}
    </Body>
  );
};
// memo를 통해 컴포넌트 렌더링 최적화
export default OrderBody;

const Body = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 8px 0;
    box-sizing: border-box;
    border-radius: 16px;
    background-color: #fff;
    box-shadow: 0px 0px 8px 0px var(--mochaBrown);
    overflow-y: scroll;
    scroll-snap-align: start;
    scrollbar-width: none;
    scroll-behavior: smooth;
    
    &::-webkit-scrollbar {
    display: none;
  }


    background-image: url(${BackgroundImage});
    background-size: cover;
    background-position: bottom;
    background-repeat: no-repeat;
    position: relative;
    z-index: 0; /* 기본 z-index 설정 */


`