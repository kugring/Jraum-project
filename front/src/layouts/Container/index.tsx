import Header from 'layouts/Header'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components';
import WebSocket from 'views/Jraum/WebSocket';

//          component: 레이어웃            //
export default function Container() {
  //          state: 현재 페이지의 path name 상태           //
  const { pathname } = useLocation();

  //          render: 레이어웃 렌더링           //
  return (
    <ContainerE>
      <WebSocket/>
      {!pathname.startsWith('/jraum/manager') && <Header />}
      <Outlet />
    </ContainerE>
  );
}

const ContainerE = styled.div`
  position: fixed;
  top:0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`