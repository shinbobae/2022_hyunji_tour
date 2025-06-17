import styled from 'styled-components';

export const HeaderStyle = styled.header`
    display: flex;
    position: fixed;
    top: 0;
    left: auto;
    right: 0;
    width: 100%;
    padding: 26px 16px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f2f5;
    z-index: 10;

    & > img {
        display: block;
        max-width: 100%;
        max-height: 100%;
    }
`;

export const LogoStyle = styled.div`
    width: 200px;
    text-align: center;
    & h1 {
        font-size: 1.6rem;
        margin-bottom: 0;
    }
`;

export const HeaderUserStyle = styled.div`
    display: flex;
    align-items: center;

    & .user-info {
        margin-left: 16px;
        & b {
            display: block;
        }
        & span {
            display: block;
            font-size: 0.75rem;
        }
    }
`;
