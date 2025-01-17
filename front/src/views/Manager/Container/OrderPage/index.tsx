import OrderList from './OrderList';
import OrderManageMent from './OrderManageMent';
import { memo, useEffect } from 'react';
import { useOrderPageStore } from 'store/manager';

//              component: 관리자 주문 페이지 컴포넌트              //
const OrderPage = () => {

    //              state: 서브 페이지 상태                 //
    const subPage = useOrderPageStore(state => state.subPage);
    const setSubPage = useOrderPageStore(state => state.setSubPage);

    //          effect: 언마운트 될때만 실행되는 이펙트             //
    useEffect(() => {
        // 컴포넌트가 마운트 될 때 실행될 코드
        return () => {
            // 컴포넌트가 언마운트 될 때 실행될 코드
            setSubPage("주문관리"); // 캘린더 표시 여부를 false로 설정
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 빈 배열을 전달하여 컴포넌트가 언마운트될 때만 실행되도록 함

    //              render: 관리자 주문 페이지 렌더링                  //
    return (
        <>
            {subPage === "주문관리" &&
                <OrderManageMent />
            }
            {subPage === "주문목록" &&
                <OrderList />
            }
        </>
    )
}

export default memo(OrderPage); 
