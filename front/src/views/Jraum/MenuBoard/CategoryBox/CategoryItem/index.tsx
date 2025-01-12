import React, { forwardRef } from 'react';
import useMenuCategoryScrollStore from 'store/menu-category-scroll.store';
import styled from 'styled-components';

//          interface: 카테고리 아이템 프롭스             //
interface CategoryItemProps {
    category: string;
    onClick: () => void;
}

//          component: 카테고리 아이템 컴포넌트             //
const CategoryItem = forwardRef<HTMLDivElement, CategoryItemProps>(({ category, onClick}, ref) => {

    //          state: 스크롤 카테고리 상테         //
    const scrollCategory = useMenuCategoryScrollStore(state => state.scrollCategory === category);

    //          render: 카테고리 아이템 렌더링          //
    return (
        <CategoryItemE ref={ref} onClick={onClick} $check={scrollCategory}>
            {category}
        </CategoryItemE>
    );
});

export default CategoryItem;

const CategoryItemE = styled.div<{ $check: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 32px;
    border-radius: 50px;
    color: ${({ $check }) => ($check ? 'var(--brickOrange)' : '#bb7a64')};
    border: 5px solid ${({ $check }) => ($check ? 'var(--brickOrange)' : '#bd8a7a')};
    background: ${({ $check }) => ($check ? '#FFF' : '#fff2ef')};
    opacity: ${({ $check }) => ($check ? '1' : '0.5')};
    box-sizing: border-box;
    font-size: 18px;
    cursor: pointer;
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        width: 62px;
        height: 28px;
        font-size: 16px;
    }
`;
