import styled from "styled-components"

export const FooterE = styled.div`
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
export const Icon = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 2px;
`

export const PageName = styled.div`
    font-size: 12px;
`