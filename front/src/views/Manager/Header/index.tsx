import styled from 'styled-components'
import { useLocation } from 'react-router-dom';
import OrderPageHeader from './OrderPageHeader';
import PointPageHeader from './PointPageHeader';
import useManagerStore from 'store/manager/manager.store';
import useBlackModalStore from 'store/modal/black-modal.store';
import MenuPageHeader from './MenuPageHeader';

//          component: 관리자 헤더 컴포넌트              //
const Header = () => {

    //          state: 현재 주소 상태            //
    const location = useLocation();
    //          state: 현재 주소 상태            //
    const currentPath = location.pathname;

    //          state: 현금 결제 대기중 상태                //
    const cashPayWaiting = useManagerStore(state => state.cashPayWaiting);

    //          state: 특정 서브경로에 대한 상태              //
    const isOrderPage = currentPath.endsWith('/order')
    const isPoint = currentPath.endsWith('/point')
    const isUser = currentPath.endsWith('/user');
    const isMenu = currentPath.endsWith('/menu');

    //          function: 블랙 모달 여는 함수               //
    const openModal = useBlackModalStore.getState().openModal
    //          function: 화이트 모달 설정 함수               //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal

    //          function: 현금 결제 응답하는 함수            //
    const openCashPayModal = () => {
        openModal()
        setWhiteModal("현금결제승인")
    };



    //          render: 관리자 헤더 렌더링              //
    return (
        <HeaderE>
            <>
                {isOrderPage &&
                    <OrderPageHeader />
                }
                {isPoint &&
                    <PointPageHeader />
                }
                {isUser &&
                    <div>회원 관리</div>
                }
                {isMenu &&
                    <MenuPageHeader/>
                }
                {!isOrderPage && !isPoint && !isUser && !isMenu && <div>Manager Main Page</div>}


                {cashPayWaiting && <CashPayButton onClick={openCashPayModal}>현금</CashPayButton>}
            </>
        </HeaderE>
    )
}

export default Header

const HeaderE = styled.div`
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    width: 100vw;
    height: 64px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    background: var(--orange);
    color: white;
    font-size: 36px;
`;


const CashPayButton = styled.div`
    flex-shrink: 0;
    padding: 8px 12px;
    margin-right: 12px;
    font-size: 16px;
    border: 2px solid #FFF;
    border-radius: 8px;
    background-color: var(--coralSunset);
`
