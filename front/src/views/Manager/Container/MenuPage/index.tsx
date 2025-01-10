import Card from './Card';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'apis/response';
import useMenuPageStore from 'store/manager/menu-page.store';
import { MdAddToPhotos } from "react-icons/md";
import useBlackModalStore from 'store/modal/black-modal.store';
import { getMenuPageRequest } from 'apis';
import { GetMenuPageResponseDto } from 'apis/response/menu';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

//          component: 메뉴 페이지 컴포넌트             //
const MenuPage = () => {

    //              state: 쿠키 상태                //
    const [cookies,] = useCookies(['managerToken']);
    //              state: 카테고리 상태            //
    const category = useMenuPageStore(state => state.category);
    //              state: 메뉴리스트 상태                //
    const menuList = useMenuPageStore(state => state.menuList);
    //              state: 메뉴리스트 상태                //
    const editMenu = useMenuPageStore(state => state.editMenu);
    //          state: 카테고리별로 그룹된 메뉴들            //
    const groupedMenuList = menuList.reduce((acc, menu) => {
        if (!acc[menu.category]) acc[menu.category] = [];
        acc[menu.category].push(menu);
        return acc;
    }, {} as Record<string, typeof menuList[0][]>);


    //              function: 카테고리 설정하는 함수                //
    const setCategory = useMenuPageStore(state => state.setCategory)
    //              function: 메뉴리스트 설정하는 함수                //
    const setMenuList = useMenuPageStore(state => state.setMenuList);
    //              function: 모달 여는 함수                //
    const openModal = useBlackModalStore.getState().openModal;
    //              function: 화이트 모달 설정 함수             //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
    //              function: 메뉴 추가 모달을 여는 함수            //
    const menuAddModal = () => { openModal(); setWhiteModal("메뉴추가"); };
    //              function: 메뉴 데이터를 가져오는 함수             //
    const getMenuPage = () => { getMenuPageRequest(category, cookies.managerToken).then(getMenuPageResponse); };
    //              function: 가져온 메뉴 데이터를 처리하는 함수              //
    const getMenuPageResponse = (responseBody: GetMenuPageResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;

        const { menuList } = responseBody as GetMenuPageResponseDto;
        setMenuList(menuList);
        console.log(menuList);
    };

    //              function: 드래그 앤 드랍을 처리하는 함수            //
    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const reorderedList = Array.from(menuList);
        const [removed] = reorderedList.splice(result.source.index, 1);
        reorderedList.splice(result.destination.index, 0, removed);

        setMenuList(reorderedList);
    };


    //          effect: 처음 렌더링시 데이터 가져오는 함수          //
    useEffect(() => {
        getMenuPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, editMenu]);

    //          effect: 언마운트 될때만 실행되는 이펙트             //
    useEffect(() => () => setCategory("커피"), [setCategory]);

    //          render: 메뉴 페이지 렌더링          //
    return (
        <MenuPageE>
            <Filter>
                <ButtonFilter>
                    <Category $select={"커피" === category} onClick={() => { setCategory("커피"); }}>커피</Category>
                    <Category $select={"논커피" === category} onClick={() => { setCategory("논커피") }}>논커피</Category>
                    <Category $select={"차" === category} onClick={() => { setCategory("차") }}>차</Category>
                    <Category $select={"음료수" === category} onClick={() => { setCategory("음료수") }}>음료수</Category>
                    <MenuAddButton>
                        <MenuAdd onClick={menuAddModal} size={24} color={"#FFF"} />
                    </MenuAddButton>
                </ButtonFilter>
            </Filter>

            {/* 드래그 상태에 따라 DragDropContext 조건부 렌더링 */}
            <DragDropContext onDragEnd={onDragEnd}>
                <CardBox>
                    {Object.entries(groupedMenuList).map(([category, menus]) => (
                        <CategoryGroup key={category} >
                            <Droppable droppableId={category}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {(menus as typeof menuList).map((menu, index) => (
                                            <Draggable key={menu.menuId} draggableId={String(menu.menuId)} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps}{...provided.dragHandleProps}>
                                                        <Card key={menu.menuId} menu={menu} index={index + 1} />
                                                    </div>
                                                )}
                                            </Draggable>))}
                                        {provided.placeholder}
                                    </div>)}
                            </Droppable>
                        </CategoryGroup>))}
                </CardBox>
            </DragDropContext>
        </MenuPageE>
    );
};

export default MenuPage;

const MenuPageE = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 18px;
  box-sizing: border-box;
  margin: 0 auto;
  width: 320px;
  height: 100%;
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const ButtonFilter = styled.div`
  display: flex;
    justify-content: space-between;
  width: 100%;
  gap: 8px;
`;

const Category = styled.div<{ $select: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 16px;
    ${({ $select }) =>
        $select
            ? `
            color: #FFF;
            background: var(--orange);
            `
            : `
            color: var(--copperBrown);
            background: #FFF;
            `}
    `;

const MenuAddButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px;
    border-radius: 8px;
    background: var(--orange);
    color: #FFF;
`

const MenuAdd = styled(MdAddToPhotos)`
`;


const CardBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    scrollbar-width: none;
    scroll-behavior: smooth;
    padding-bottom: 12px;
    overflow: scroll;
    scrollbar-width: none;           /* Firefox */
    -ms-overflow-style: none; 
    &::-webkit-scrollbar {              // 크롬
    display: none;
    }


  /* &::after {
    content: '';
    position: absolute;
    top: 80%;   // 80% 지점에서 시작
    left: 0;
    width: 100%;
    height: 10%;  // 10% 지점까지 표시
    background-color: rgba(255, 0, 0, 0.3);  // 시각적으로 구분할 수 있도록 반투명 빨간색 배경
    z-index: 100;  // 다른 콘텐츠 위에 표시되도록 설정
  } */
`;

const CategoryGroup = styled.div`
`;


