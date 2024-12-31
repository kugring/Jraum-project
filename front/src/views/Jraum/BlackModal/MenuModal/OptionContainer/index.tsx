import styled from 'styled-components'
import { memo } from 'react'
import OptionBox from './OptionBox/indext';
import OptionHeader from './OptionHeader'


//          component: 옵션_컨테이너 컴포넌트           //
const OptionContainer = () => {

  //            render: 옵션 컨테이너 렌더링            //
  return (
    <Container>
      <OptionHeader />
      <OptionBox />
    </Container>
  )
}
export default memo(OptionContainer);

const Container = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    border: 3px solid #E4B6A6;
`
