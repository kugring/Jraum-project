import Header from './Header'
import Footer from './Footer'
import styled from 'styled-components'
import WSSubscription from './WSSubscription'
import BlackModal from './BlackModal'
import { Outlet } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { ToastContainer } from 'react-toastify'
import { memo, useEffect } from 'react'
import { useBlackModalStore } from 'store/modal'

//          component: 관리자 컴포넌트              //
const Manager = () => {

    //          state: 쿠키 상태            //
    const [cookies,] = useCookies(['managerToken']);

    //          effect: 관리자 토큰 확인 이펙트             //
    useEffect(() => {
        // managerToken이 없을 때 모달을 열도록 처리
        if (!cookies.managerToken) {
            const { openModal, setWhiteModal } = useBlackModalStore.getState();
            openModal();
            setWhiteModal("핀");
        }
    }, [cookies.managerToken]); // 의존성 배열에 cookies.managerToken 추가
    //          render: 관리자 렌더링              //
    return (
        <ManagerE>
            {cookies.managerToken &&
                <>
                    <Header />
                    <ContainerE />
                    <Footer />
                    <WSSubscription />
                </>
            }
            <BlackModal />
        </ManagerE>
    )
}
export default memo(Manager);

//          component: 관리자 컨테이너 컴포넌트              //
const ContainerE = memo(() => {
    //          render: 관리자 컨테이너 렌더링              //
    return (
        <Container>
            <ToastContainer style={{ fontSize: "18px" }} />
            <Outlet />
        </Container>
    )
})



const ManagerE = styled.div`
    position: fixed;
    top:0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--seashell);
`

const Container = styled.div`
    position: absolute;
    top: 64px;
    background-color: var(--creamyYellow);
    width: 100%;
    height: calc(100% - 64px - 64px);
`

