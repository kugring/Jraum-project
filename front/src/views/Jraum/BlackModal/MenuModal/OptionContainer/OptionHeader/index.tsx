import styled from 'styled-components';
import OptionTitle from './OptionTitle';
import useOrderItemStore from 'store/modal/order-list-item.store';
import { Fragment, memo } from 'react';

//          component: 옵션_헤더 컴포넌트           //
const OptionHeader = () => {
      
    //      state: 중복 제거된 카테고리들 상태              //
    const categories = useOrderItemStore.getState().orderItem.menuInfo.sortedOptionCategory;

    //          render: 옵션 상단 헤더 렌더링           //
    return (
        <Header>
            {categories.map((category, index) => (
                <Fragment key={category}>
                    <OptionTitle 
                        category={category} 
                    />
                    {categories.length !== index + 1 && <Divider />}
                </Fragment>
            ))}
        </Header>
    );
};
export default memo(OptionHeader);

const Header = styled.div`
    display: flex;
    justify-content: space-evenly;
    border-bottom: 2px solid var(--pinkBeige);
`;

const Divider = styled.div`
    margin: 14px 0;
    border-left: 2px solid var(--pinkBeige);
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
    margin: 8px 0;
  }
`