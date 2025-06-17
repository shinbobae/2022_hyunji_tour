import styled from 'styled-components';

export const Wrap = styled.div`
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
`;

export const ContentWrap = styled.div`
    position: relative;
    height: calc(100% - 110px); // 헤더 높이 빼기
`;
