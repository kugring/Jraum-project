import { memo } from 'react';
import useOrderItemStore from 'store/modal/order-list-item.store';
import styled from 'styled-components';

//      interface: 옵션 제목 프롭스       //
interface OptionTitleProps {
    category: string;
}

//      component: 옵션 제목 컴포넌트         //
const OptionTitle = ({category}: OptionTitleProps) => {


    //          state: 현재 보여질 옵션 카테고리 상태           //
    const showOption = useOrderItemStore((state) => state.showOption === category);
    const setShowOption = useOrderItemStore.getState().setShowOption;

  //      render: 옵션 제목 렌더링        //
  return (
    <Title onClick={() => setShowOption(category)} $active={showOption}>
      {category}
    </Title>
  )
}
export default memo(OptionTitle); 

const Title = styled.div<{ $active: boolean }>`
    text-align: center;
    font-size: 30px;
    padding: 16px 0;
    min-width: 82px;
    color: ${({ $active }) => ($active ? "var(--coralPink)" : "var(--pinkBeige)")};
    border-bottom: ${({ $active }) => ($active ? "3px solid var(--coralPink)" : "none")};
`