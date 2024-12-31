import styled from 'styled-components';
import CategoryBox from './CategoryBox';
import MenuContainer from './MenuContainer';
import { memo, useRef } from 'react';

//          interface: 메뉴 컨테이너 참조         //
interface MenuContainerRef {
    scrollToCategory: (category: string) => void;
}

//          component: 메뉴 보드 컴포넌트           //
const MenuBoard = () => {

    //          state: 메뉴 컨테이너 참조 상태          //
    const menuContainerRef = useRef<MenuContainerRef>(null);

    //          function: 카테고리 클릭 핸들러 함수             //
    const handleCategoryClick = (category: string) => {
        if (menuContainerRef.current) {
            menuContainerRef.current.scrollToCategory(category);
        }
    };
    //          render: 메뉴 보드 렌더링            //
    return (
        <MenuBoardE>
            <CategoryBox onCategoryClick={handleCategoryClick}/>
            <MenuContainer ref={menuContainerRef}/>
        </MenuBoardE>
    );
};


export default memo(MenuBoard);

const MenuBoardE = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-image: url('https://i.pinimg.com/736x/03/c1/09/03c10990cd30094c1560ab88ff98aaf4.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    z-index: 0;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 246, 236, 0.9);
        transition: background-color 0.5s ease-in-out;
        z-index: -1;
    }
`;
