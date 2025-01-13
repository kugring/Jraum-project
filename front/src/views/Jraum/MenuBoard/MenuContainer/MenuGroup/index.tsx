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
      <MenuGroupE ref={ref} data-category={category}>
        <CategoryBadge>{category}</CategoryBadge>
        <MenuCardBox>
          {menuList.map((menu) => (
            <MenuCard key={menu.menuId} menuId={menu.menuId} image={menu.image} name={menu.name} price={menu.price} temperature={menu.temperature} />
          ))}
        </MenuCardBox>
      </MenuGroupE>
    );
  });

export default memo(MenuGroup);



const MenuGroupE = styled.div`
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
    border: 5px solid var(--brickRed);
    border-radius: 50px;
    box-sizing: border-box;
    font-size: 24px;
    color: var(--brickRed);
    background: #FFF;
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
      display: none;
    }
`

const MenuCardBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: calc((100% - 180px * 4) / 3);
    width: 100%;

    
    /* 반응형 스타일 적용 */
    @media (max-width: 1136px) {
      grid-template-columns: repeat(3, 1fr);
      gap: calc((100% - 180px * 3 ) / 2);
      row-gap: 8px;
  }

        
    /* 반응형 스타일 적용 */
    @media (max-width: 948px) {
      grid-template-columns: repeat(2, 1fr);
      gap: calc((100% - 180px * 2 ) / 1);
      row-gap: 8px;
    }


    /* 아래부터는 모바일 */

        
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
      gap: calc((100% - 150px * 4) / 3);
      row-gap: 4px;
    }


    /* 반응형 스타일 적용 */
    @media (max-width: 640px) {
      grid-template-columns: repeat(3, 1fr);
      gap: calc((100% - 150px * 3) / 2);
      row-gap: 4px;
    }
      

    /* 반응형 스타일 적용 */
    @media (max-width: 482px) {
      grid-template-columns: repeat(2, 1fr);
      gap: calc((100% - 150px * 2) / 1);
      row-gap: 4px;
    }
`
