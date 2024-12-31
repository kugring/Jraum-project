import styled from 'styled-components'
import Footer from './Footer'
import PinCheck from './PinCheck'
import { useCookies } from 'react-cookie'
import { Outlet } from 'react-router-dom'
import Header from './Header'

//          component: 관리자 컴포넌트              //
const Manager = () => {


    //          state: 쿠키 상태            //
    const [cookies,] = useCookies(['managerToken']);


    //          render: 관리자 렌더링              //
    return (
        <ManagerE>
            {cookies.managerToken === undefined ?
                <PinCheck />
                :
                <>
                    <Header />
                    <Container>
                        <Outlet />
                    </Container>
                    <Footer />
                </>
            }
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

    background-color: rgba(0,0,0,0.6);
`

const Container = styled.div`
    position: absolute;
    top: 64px;
    background-color: var(--creamyYellow);
    width: 100%;
    height: calc(100% - 64px - 64px);
`

