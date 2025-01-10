import Modals from 'views/Jraum/BlackModal';
import OrderBoard from 'views/Jraum/OrderBorad';
import styled from 'styled-components';
import MenuBoard from 'views/Jraum/MenuBoard';
import StandbySceen from './StandbySceen';
import WebSocket from './WebSocket';

//          component: 제이라움 화면 컴포넌트           //
const Jraum = () => {

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


