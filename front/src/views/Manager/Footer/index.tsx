import styled from 'styled-components'
import { memo } from 'react'
import { IoMdListBox } from "react-icons/io";
import { useLocation, useNavigate } from 'react-router-dom';
import { IoPersonSharp } from "react-icons/io5";
import { MdAddToPhotos } from "react-icons/md";
import { FaHandHoldingDollar } from "react-icons/fa6";


//                  component: 관리자 푸터 컴포넌트              //
const Footer = () => {
    //                  render: 관리자 푸터 렌더링              //
    return (
        <FooterE>
            <SubPageIconE subPage={'order'}>
                <IoMdListBox size={26} />
                <PageName>{'주문 관리'}</PageName>
            </SubPageIconE>
            <SubPageIconE subPage={'point'}>
                <FaHandHoldingDollar size={26} />
                <PageName>{'포인트 관리'}</PageName>
            </SubPageIconE>
            <SubPageIconE subPage={'user'}>
                <IoPersonSharp size={24} />
                <PageName>{'회원 관리'}</PageName>
            </SubPageIconE>
            <SubPageIconE subPage={'menu'}>
                <MdAddToPhotos size={24} />
                <PageName>{'메뉴 관리'}</PageName>
            </SubPageIconE>
        </FooterE>
    );
};

//                  component: 서브 페이지 이동 아이콘 컴포넌트                 //
const SubPageIconE = memo(({ subPage, children }: { subPage: string; children: React.ReactNode }) => {
    const navigate = useNavigate(); // useNavigate는 항상 새로 생성되지 않음

    const location = useLocation();
    const currentPath = location.pathname;
    // 경로에서 가장 끝에 있는 부분만 추출
    const lastPathSegment = currentPath.split('/').filter(Boolean).pop();


    //                  render: 서브 페이지 이동 아이콘 렌더링              //
    return (
        <Icon $select={lastPathSegment === subPage} onClick={() => navigate(subPage)}>
            {children}
        </Icon>
    );
});

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
`;

const Icon = styled.div<{$select: boolean}>`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 2px;
    opacity: ${({$select}) => $select ? "1" : "0.7"};
`;

const PageName = styled.div`
    font-size: 12px;
`;
