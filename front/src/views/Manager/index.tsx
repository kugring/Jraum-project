import Header from './Header'
import Footer from './Footer'
import styled from 'styled-components'
import WebSocket from './WebSocket'
import BlackModal from './BlackModal'
import { Outlet } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import { useBlackModalStore } from 'store/modal'

//          component: 관리자 컴포넌트              //
const Manager = () => {

    //          state: 쿠키 상태            //
    const [cookies,] = useCookies(['managerToken']);

    //          effect: 관리자 토큰 확인 이펙트             //
    useEffect(() => {
        if (cookies.managerToken === undefined) {
            const { openModal, setWhiteModal } = useBlackModalStore.getState();
            openModal();
            setWhiteModal("핀")
        }

    }, [cookies.managerToken === undefined]);

    //          render: 관리자 렌더링              //
    return (
        <ManagerE>
            {cookies.managerToken !== undefined &&
                <>
                    <Header />
                    <Container>
                        <ToastContainer style={{ fontSize: "18px" }} />
                        <Outlet />
                    </Container>
                    <Footer />
                    <WebSocket />
                </>
            }
            <BlackModal />
        </ManagerE>
    )
}

export default Manager

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

