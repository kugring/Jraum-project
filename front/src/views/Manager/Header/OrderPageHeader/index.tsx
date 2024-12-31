import React from 'react'
import useOrderManagementStore from 'store/manager/order-management.store';
import useOrderPageStore from 'store/manager/order-page.store';
import styled from 'styled-components';

//              component: 관리자 주문 페이지 헤더 컴포넌트트                     //
const OrderPageHeader = () => {

    //          state: 주문 데이터 상태         //
    const waitingNum = useOrderManagementStore(state => state.orders?.length);
    //          state: 서브 페이지 상태               //
    const subPage = useOrderPageStore(state => state.subPage);    
    //          function: 서브 페이지를 설정하는 함수               //
    const setSubPage = useOrderPageStore.getState().setSubPage;

    //              render: 관리자 주문 페이지 헤더 렌더링                  //
    return (
        <Header>
            <SubPageBox>
                <SubPage $select={subPage === "주문관리"} onClick={() => setSubPage("주문관리")}>주문 관리</SubPage>
                <SubPage $select={subPage === "주문목록"} onClick={() => setSubPage("주문목록")}>주문 목록</SubPage>
            </SubPageBox>
            <WaitingNum>{`대기: ${waitingNum}`}</WaitingNum>
        </Header>
    )
}

export default OrderPageHeader


const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 8px;
`

const SubPageBox = styled.div`
    display: flex;
`

const WaitingNum = styled.div`
    font-size: 24px;
    padding-right: 12px;
`

const SubPage = styled.div<{$select: boolean}>`
    position: relative;
    font-size: 20px;
    padding: 4px 12px;
    ${({$select}) => $select ?
    `
    &::after{
        content: "";
        position: absolute;
        bottom: -2px;
        width: 80%;
        border-bottom: solid 2px #FFF;
        left: 50%; /* 상위 요소의 가로 중앙으로 이동 */
        transform: translateX(-50%); /* 자신의 너비의 절반만큼 왼쪽으로 이동 */
    }
    ` 
    :
    `opacity: 0.6;`
    }

`
