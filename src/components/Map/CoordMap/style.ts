import styled from 'styled-components';

export const colors = [
    'pink',
    'red',
    'yellow',
    'orange',
    'cyan',
    'green',
    'blue',
    'purple',
    'geekblue',
    'magenta',
    'volcano',
    'gold',
    'lime',
];

export const RoadPinStyle = styled.span<{ noname: boolean; active: boolean }>`
    display: block;
    width: 16px;
    height: 16px;
    background-color: ${(props) => (props.noname ? `#70e700` : props.active ? `#70e700` : `#5990ff`)};
    border-radius: 50%;
    border: 2px solid #fff;
    //transform: translateY(-50%);
`;

export const LocationStyle = styled.span<{ index?: number }>`
    display: block;
    position: relative;
    width: 16px;
    height: 16px;
    background-color: #faad14;
    border-radius: 50%;
    border: 2px solid #fff;

    &::before {
        content: '';
        position: absolute;
        z-index: -1;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        margin-left: -40px;
        margin-top: -40px;
        animation: 1.5s infinite ease-in-out;
        animation-delay: 0.5s;
        animation-name: loader1;
        @keyframes loader1 {
            from {
                transform: scale(0);
                background-color: #d48806;
                opacity: 0.6;
            }
            to {
                transform: scale(1);
                background-color: #d48806;
                opacity: 0;
            }
        }
    }
`;
