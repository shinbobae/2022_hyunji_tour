import styled from 'styled-components';

export const SideBarStyle = styled.div<{ collapse: boolean }>`
    position: fixed;
    left: ${(props) => (props.collapse ? '-100%' : 0)};
    top: 0;
    width: auto;
    height: 100%;
    padding: 100px 16px 16px;
    background-color: transparent;
    box-sizing: border-box;
    transition: all 0.2s ease-in-out;
`;

export const MenuItemStyle = styled.div`
    margin-bottom: 1rem;
    & .link {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 220px;
        padding: 1rem;
        color: #bfbfbf;
        border-radius: 1.4rem;
        transition: all 0.1s ease-out;

        & > * {
            flex-grow: 0;
        }
        & span {
            flex-grow: 1;
            margin-left: 1rem;
            text-transform: capitalize;
        }
        & .arrow {
            color: transparent;
        }

        &:hover {
            color: #76a2ff;
            background-color: #eeeeee;
        }

        &.active {
            color: #fff;
            background: linear-gradient(83.26deg, #1362fc 17.33%, #13a8fc 98.93%);

            & .arrow {
                color: #fff;
            }
        }
    }
`;
