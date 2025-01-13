import styled from 'styled-components';
import Modals from 'views/Jraum/BlackModal';
import WebSocket from './WebSocket';
import MenuBoard from 'views/Jraum/MenuBoard';
import OrderBoard from 'views/Jraum/OrderBorad';
import StandbySceen from './StandbySceen';

//          component: 제이라움 화면 컴포넌트           //
const Jraum = () => {

  //            render: 제이라움 화면 컴포넌트           //
  return (
    <Container>
      <WebSocket />
      <StandbySceen />
      <MenuBoard />
      <OrderBoard />
      <Modals />
    </Container>
  );
};

export default Jraum;

const Container = styled.div`
  display: flex;
  height: 93%;
`;


