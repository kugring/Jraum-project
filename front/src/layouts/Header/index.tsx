/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components';
import StyledLink from 'components/Board/LinkButton';
import UserInfoBox from 'components/header/UserInfoBox';


//          component: 헤더 컴포넌트                //
const Header = () => {

    //          render: 헤더 렌더링             //
    return (
        <HeaderEL>
            <LinkGroup>
                <StyledLink title={"제이라움"} to={"/jraum"}></StyledLink>
                <StyledLink title={"주문내역"} to={"/jraum/orderDetail"}></StyledLink>
            </LinkGroup>
            <UserInfoBox/>
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

    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        padding: 0 8px;
    }

`;

const LinkGroup = styled.div`
    display: flex;
    gap: 24px;

    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        gap: 8px;
    }
`;


