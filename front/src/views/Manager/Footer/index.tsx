import React, { memo } from 'react'
import styled from 'styled-components'
import { FaHandHoldingDollar } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { IoMdListBox } from "react-icons/io";
import { MdAddToPhotos } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


//          component: 관리자 푸터 컴포넌트              //
const Footer = () => {

    //      state: 내비게이트 상태          //
    const navigate = useNavigate();

    //          render: 관리자 푸터 렌더링              //
    return (
        <FooterE>
            <Icon onClick={() => navigate('order')} >
                <IoMdListBox size={26}/>
                <PageName>주문 관리</PageName>
                </Icon>
            <Icon onClick={() => navigate('point')} >
                <FaHandHoldingDollar size={26}/>
                <PageName>포인트 관리</PageName>
                </Icon>
            <Icon onClick={() => navigate('user')} >
                <IoPersonSharp size={24}/>
                <PageName>회원 관리</PageName>
                </Icon>
            <Icon onClick={() => navigate('menu')} >
                <MdAddToPhotos size={24}/>
                <PageName>메뉴 관리</PageName>
                </Icon>
        </FooterE>
    )
}

export default memo(Footer);

const FooterE = styled.div`
    position: fixed;
    bottom: 0;
    display: flex;
    width: 100vw;
    height: 64px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    background: var(--orange);
    color: white;
`
const Icon = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 2px;
`

const PageName = styled.div`
    font-size: 12px;
`