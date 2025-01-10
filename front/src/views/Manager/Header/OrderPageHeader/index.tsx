import styled from "styled-components";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { useOrderManagementStore, useOrderPageStore } from 'store/manager';

//              component: 관리자 주문 페이지 헤더 컴포넌트트                     //
const OrderPageHeader = () => {

    //          state: 주문 데이터 상태         //
    const waitingNum = useOrderManagementStore(state => state.orders?.length);
    //          state: TTS 음성 듣기 상태         //
    const openTTS = useOrderManagementStore(state => state.openTTS);
    //          state: 서브 페이지 상태               //
    const subPage = useOrderPageStore(state => state.subPage);
    //          function: 서브 페이지를 설정하는 함수               //
    const setSubPage = useOrderPageStore.getState().setSubPage;
    //          function: TTS 음성 듣기 설정 함수         //
    const setOpenTTS = useOrderManagementStore.getState().setOpenTTS;

    //              render: 관리자 주문 페이지 헤더 렌더링                  //
    return (
        <Header>
            <SubPageBox>
                <SubPage $select={subPage === "주문관리"} onClick={() => setSubPage("주문관리")}>주문 관리</SubPage>
                <SubPage $select={subPage === "주문목록"} onClick={() => setSubPage("주문목록")}>주문 목록</SubPage>
            </SubPageBox>
            <RightE>
                <WaitingNum>{`대기: ${waitingNum}`}</WaitingNum>
                <OpenTTS onClick={() => setOpenTTS(!openTTS)}>
                    {openTTS ? <ImCheckboxChecked size={14} /> : <ImCheckboxUnchecked size={14} />}음성
                </OpenTTS>
            </RightE>
        </Header>
    )
}

export default OrderPageHeader


const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 8px;
`

const SubPageBox = styled.div`
    display: flex;
`

const WaitingNum = styled.div`
    font-size: 20px;
`

const SubPage = styled.div<{ $select: boolean }>`
    position: relative;
    font-size: 18px;
    padding: 4px 12px;
    ${({ $select }) => $select ?
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

const RightE = styled.div`
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    row-gap: 4px;
`

const OpenTTS = styled.div`
    display: flex;
    font-size: 14px;
    justify-content: center;
    align-items: center;
    gap: 6px;
`
