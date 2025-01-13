import styled from 'styled-components';
import CategoryItem from './CategoryItem';
import { menuCategories } from 'constant';
import { memo, useMemo, useRef } from 'react';

//          interface: 카테고리 박스 프롭스         //
interface CategoryBoxProps {
    onCategoryClick: (category: string) => void;
}

//          component: 카테고리 박스 컴포넌트             //
const CategoryBox = ({ onCategoryClick }: CategoryBoxProps) => {



    //          state: 카테고리 참조            //
    const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    //          state: 타이틀 메모 참조            //
    const TitleMemo = useMemo(() => <Title>카테고리 선택</Title>, []);  // Label은 한 번만 렌더링됨

    //          render: 카테고리 박스 렌더링            //
    return (
        <CategoryBoxE>
            {TitleMemo}
            <CategoryGroup>
                {menuCategories.map((category) => (
                    <CategoryItem
                        key={category}
                        ref={(el) => (categoryRefs.current[category] = el)}
                        onClick={() => onCategoryClick(category)}
                        category={category}
                    />
                ))}
            </CategoryGroup>
        </CategoryBoxE>
    );
};

export default memo(CategoryBox);

const CategoryBoxE = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 24px;
    height: 7vh;
    box-sizing: border-box;
    box-shadow: 0px 4px 4px 0px rgba(152, 90, 46, 0.25);
      
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
    height: 9vw;
    max-height: 42px;
    padding: 0 16px;
    }
`;

const Title = styled.div`
    font-size: 20px;
    color: var(--brickOrange);
    
    /* 반응형 스타일 적용 */
    @media (max-width: 968px) {
        display: none;
    }
`;

const CategoryGroup = styled.div`
    display: flex;
    gap: 24px;
    /* 반응형 스타일 적용 */
    @media (max-width: 968px) {
        justify-content: space-between;
        width: 100%;
    }
`;

