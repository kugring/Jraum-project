import React from 'react'
import usePointPageStore from 'store/manager/point-page.store'
import styled from 'styled-components'

//              component: 관리자 포인트 페이지 헤더 컴포넌트               //
const PointPageHeader = () => {

    //          subComponent: 서브 페이지                 //
    const SubPageE = ({ subPage }: { subPage: string }) => {
        const subPageText = subPage.replace(" ", "");
        return <><SubPage $select={usePointPageStore(state => state.subPage === subPageText)} onClick={() => usePointPageStore.getState().setSubPage(subPageText)}>{subPage}</SubPage></>
    }

    //              render: 관리자 포인트 페이지 헤더 렌더링                //
    return (
        <Header>
            <SubPageBox>
                <SubPageE subPage={'직접 충전'}/>
                <SubPageE subPage={'충전 요청'}/>
                <SubPageE subPage={'충전 내역'}/>
            </SubPageBox>
        </Header>
    )
}

export default PointPageHeader



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
