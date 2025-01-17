import styled from "styled-components";
import { useMenuPageStore } from "store/manager";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";


//              component: 관리자 메뉴 페이지 헤더 컴포넌트               //
const MenuPageHeader = () => {
    
    //          state: 메뉴 순서 편집 허용 상태             //
    const editSequence = useMenuPageStore(state => state.editSequence);

    //          subComponent: 서브 페이지                 //
    const SubPageE = ({ subPage }: { subPage: string }) => {
        const subPageText = subPage.replace(" ", "");
        return <><SubPage $select={useMenuPageStore(state => state.subPage === subPageText)} onClick={() => useMenuPageStore.getState().setSubPage(subPageText)}>{subPage}</SubPage></>
    }

    //          event handler: 메뉴 순서 편집 이벤트 핸들러             //
    const onClickSeqeunceEdit = () => {
        useMenuPageStore.getState().toggleEditSequence();
    }

    //              render: 관리자 메뉴 페이지 헤더 렌더링                //
    return (
        <Header>
            <SubPageBox>
                <SubPageE subPage={'메뉴 관리'}/>
                <SubPageE subPage={'옵션 관리'}/>
            </SubPageBox>

            <SequenceEdit onClick={onClickSeqeunceEdit}>
                    {editSequence ? <ImCheckboxChecked size={14} /> : <ImCheckboxUnchecked size={14} />}순서 편집
            </SequenceEdit>
        </Header>
    )
}

export default MenuPageHeader


const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 8px;
`

const SubPageBox = styled.div`
    display: flex;
    width: 100%;
`

const SubPage = styled.div<{$select: boolean}>`
    position: relative;
    font-size: 18px;
    padding: 4px 12px;
    ${({$select}) => $select ?
    `
    &::after{
        content: "";
        position: absolute;
        bottom: -2px;
        width: 80%;
        border-bottom: solid 2px #FFF;
        left: 50%; /* 상위 요소의 가로 중앙으로 이동 */
        transform: translateX(-50%); /* 자신의 너비의 절반만큼 왼쪽으로 이동 */
    }
    ` 
    :
    `opacity: 0.6;`
    }

`

const SequenceEdit = styled.div`
    display: flex;
    font-size: 14px;
    justify-content: center;
    align-items: center;
    gap: 6px;
    white-space: nowrap; /* 텍스트 줄바꿈을 하지 않도록 설정 */
`