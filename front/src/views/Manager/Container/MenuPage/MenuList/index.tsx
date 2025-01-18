import Card from './Card';
import styled from 'styled-components';
import SequenceCard from './SequenceCard';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'apis/response';
import { MdAddToPhotos } from "react-icons/md";
import { useMenuPageStore } from 'store/manager';
import { useBlackModalStore } from 'store/modal';
import { useQuery } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getMenuPageRequest } from 'apis';
import { GetMenuPageResponseDto } from 'apis/response/menu';

//          component: 메뉴 페이지 컴포넌트             //
const MenuList = () => {

    //          render: 메뉴 페이지 렌더링          //
    return (
        <MenuPageE>
            <FilterE />
            <CardBoxE />
        </MenuPageE>
    );
};
//              component: 메뉴 필터 컴포넌트               //
const FilterE = () => {

    //              function: 모달 여는 함수                //
    const openModal = useBlackModalStore.getState().openModal;
    //              function: 화이트 모달 설정 함수             //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
    //              function: 메뉴 추가 모달을 여는 함수            //
    const menuAddModal = () => { openModal(); setWhiteModal("메뉴추가"); };

    //              render: 메뉴 필터 렌더링               //
    return (
        <Filter>
            <ButtonFilter>
                <CategoryE cate={"커피"} />
                <CategoryE cate={"논커피"} />
                <CategoryE cate={"차"} />
                <CategoryE cate={"음료수"} />
                <MenuAddButton>
                    <MenuAdd onClick={menuAddModal} size={24} color={"#FFF"} />
                </MenuAddButton>
            </ButtonFilter>
        </Filter>
    )
}
//              component: 메뉴 카테고리 버튼 컴포넌트               //
const CategoryE = ({ cate }: { cate: string }) => {
    //              state: 카테고리 상태                //
    const select = useMenuPageStore(state => state.category === cate);
    //              render: 메뉴 카테고리 버튼 렌더링               //
    return (<Category $select={select} onClick={() => { useMenuPageStore.getState().setCategory(cate) }}>{cate}</Category>)
}
//              component: 카드 박스 컴포넌트               //
const CardBoxE = () => {

    //          state: 메뉴 순서 편집 허용 상태             //
    const editSequence = useMenuPageStore(state => state.editSequence);
    //              state: 쿠키 상태                //
    const [cookies,] = useCookies(['managerToken']);
    //              state: 메뉴리스트 상태                //
    const menuList = useMenuPageStore(state => state.menuList);
    //              state: 수정될 메뉴 상태                //
    // const editMenu = useMenuPageStore(state => state.editMenu);
    //              state: 카테고리 상태                //
    const category = useMenuPageStore(state => state.category)

    //              function: 카테고리 설정하는 함수                //
    const setCategory = useMenuPageStore.getState().setCategory;
    //              function: 메뉴리스트 설정하는 함수                //
    const setMenuList = useMenuPageStore.getState().setMenuList;

    //          function: 주문 뱃지 데이터 가져오는 함수           //
    const { data: menuListQ, isSuccess } = useQuery<GetMenuPageResponseDto | ResponseDto | null>({
        queryKey: ['menuListQ', category],
        queryFn: () => getMenuPageRequest(category, cookies.managerToken),
        staleTime: 1000 * 60, // 1분
        notifyOnChangeProps: ['data'] // 'data' 필드가 변경될 때만 리렌더링        
    });
    //              function: 가져온 메뉴 데이터를 처리하는 함수              //
    const getMenuPageResponse = (responseBody: GetMenuPageResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;
        const { menuList } = responseBody as GetMenuPageResponseDto;
        setMenuList(menuList);
    };

    //              function: 드래그 앤 드랍을 처리하는 함수            //
    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedList = Array.from(menuList);
        const [removed] = reorderedList.splice(result.source.index, 1);
        reorderedList.splice(result.destination.index, 0, removed);
        setMenuList(reorderedList);
    };

    //          effect: 처음 렌더링시 화면에 주문 상태 보여줌           //
    useEffect(() => {
        if (isSuccess && menuListQ) {
            getMenuPageResponse(menuListQ);
        }
    }, [menuListQ, isSuccess]);


    //          effect: 언마운트 될때만 실행되는 이펙트             //
    useEffect(() => () => setCategory("커피"), [setCategory]);

    //              render: 카드 박스 렌더링               //
    return (
        <>
            {isSuccess ? (
                !editSequence ?
                    (<CardBox>
                        {Array.isArray(menuList) && menuList.length > 0 ? (
                            menuList.map((menu, index) => (
                                <Card key={menu.menuId} menu={menu} index={index + 1} />
                            ))
                        ) : (
                            <Message>메뉴가 없습니다.</Message> // 메뉴가 없을 경우
                        )}
                    </CardBox>) :
                    (<DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="menuList">
                            {(provided) => (
                                <CardBox ref={provided.innerRef} {...provided.droppableProps}>
                                    {menuList.length > 0 ? (
                                        menuList.map((menu, index) => (
                                            <Draggable key={menu.menuId} draggableId={String(menu.menuId)} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <SequenceCard key={menu.menuId} menu={menu} index={index + 1} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    ) : (
                                        <Message>메뉴가 없습니다.</Message> // 메뉴가 없을 경우
                                    )}
                                    {provided.placeholder}
                                    {/* <SaveButtonE /> */}
                                </CardBox>
                            )}
                        </Droppable>
                    </DragDropContext>)) : (
                <Message>Loading...</Message> // 에러 발생 시
            )}
        </>
    );

}
export default MenuList;


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
`;

const Message = styled.div`
    width: 100%;
    padding: 24px;
    text-align: center;
    color: var(--copperBrown);
`

