/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components';
import StyledLink from 'components/Board/LinkButton';
import UserInfoBox from 'components/header/UserInfoBox';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';


//          component: 헤더 컴포넌트                //
const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    //          render: 헤더 렌더링             //
    return (
        <HeaderEL>
            <HeaderRight>
                <HamburgerIcon onClick={toggleMenu}>
                    <FaBars size={24} />
                </HamburgerIcon>
                <StyledLink title={"제이라움"} to={"/jraum"} />
                <LinkGroup $show={isMenuOpen}>
                    <StyledLink title={"주문내역"} to={"/jraum/manager/order"} />
                </LinkGroup>
            </HeaderRight>
            <UserInfoBoxStyled $show={!isMenuOpen}>
                <UserInfoBox />
            </UserInfoBoxStyled>
        </HeaderEL>
    );
};

export default Header;

const HeaderEL = styled.div`
    display: flex;
    width: 100vw;
    height: 7%;
    padding: 0 16px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    background: var(--orange);
    color: white;

    @media (max-width: 768px) {
        padding: 0 8px;
    }
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
`

const HamburgerIcon = styled.div`
    cursor: pointer;
    color: white;
    display: none;

    &:hover {
        color: var(--blue);
    }

    @media (max-width: 768px) {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
    }
`;

const LinkGroup = styled.div<{ $show: boolean }>`
    display: flex;
    gap: 24px;

    @media (max-width: 768px) {
        display: ${({ $show }) => ($show ? "flex" : "none")};
        gap: 8px;
        padding: 8px;
    }
`;

const UserInfoBoxStyled = styled.div<{ $show: boolean }>`
    display: ${({ $show }) => ($show ? "flex" : "none")};
`;