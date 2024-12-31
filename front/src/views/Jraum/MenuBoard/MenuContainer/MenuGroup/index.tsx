import { forwardRef, memo } from 'react'
import { MenuListItem } from 'types/interface';
import MenuCard from './MenuCard';
import styled from 'styled-components';

//          interface: 메뉴 그룹 프롭스           //
interface MenuGroupProps {
    menuList: MenuListItem[];
    category: string;
}

//          component: 메뉴 그룹 컴포넌트               //
const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(({ menuList, category }, ref) => {

    //          render: 메뉴 그룹 렌더링            //
    return (
      <Container ref={ref} data-category={category}>
        <CategoryBadge>{category}</CategoryBadge>
        <MenuGroupBox>
          {menuList.map((menu) => (
            <MenuCard key={menu.menuId} menuId={menu.menuId} image={menu.image} name={menu.name} price={menu.price} temperature={menu.temperature} />
          ))}
        </MenuGroupBox>
      </Container>
    );
  });

export default memo(MenuGroup);




const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap:16px;
    padding: 16px;
`

const CategoryBadge = styled.div`
    display: flex;
    justify-self: baseline;
    align-items: center;
    width: fit-content;
    height: 42px;
    padding: 0 18px;
    border: 5px solid #541602;
    border-radius: 50px;
    box-sizing: border-box;
    font-size: 24px;
    color: #541602;
    background: #FFF;
`

const MenuGroupBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap:4px;
`
