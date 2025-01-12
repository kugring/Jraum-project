import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface StyledLinkProps {
    title: string;
    to: string;
}

const StyledLink = ({title, to}: StyledLinkProps) => {
  return (
    <Container to={to}>
      {title}
    </Container>
  )
}

export default StyledLink



const Container = styled(Link)`
    text-decoration: none;
    color: #FFF;
    font-size: 26px;
    padding: 8px 8px;

    &:hover {
        opacity: 0.7;
    }
    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
      font-size: 18px;
    }
`;