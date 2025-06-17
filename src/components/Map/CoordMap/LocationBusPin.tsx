import * as React from 'react';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import { Tooltip } from 'antd';
import styled from 'styled-components';

export const colors = [
    '#ffaa14',
    '#fadb14',
    '#a0d911',
    '#52c41a',
    '#13c2c2',
    '#1890ff',
    '#2f54eb',
    '#722ed1',
    '#eb2f96',
    '#f5222d',
    '#fa541c',
    '#fa8c16',
];

type Props = {
    title: string;
    index: number;
    active: boolean;
};

const LocationPinStyle = styled.div<{ index: number; active: boolean }>`
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    padding: 0.2rem;
    background-color: ${(props) => (props.active ? colors[props.index % 12] : 'rgba(255, 255, 255, 0.9)')};
    border-width: 2px;
    border-style: solid;
    border-color: ${(props) => colors[props.index % 12]};
    border-radius: 50%;

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
                background-color: ${(props) => colors[props.index % 12]};
                opacity: 0.6;
            }
            to {
                transform: scale(1);
                background-color: ${(props) => colors[props.index % 12]};
                opacity: 0;
            }
        }
    }
`;

const LocationBusPin = ({ title, index, active }: Props) => {
    return (
        <Tooltip title={title}>
            <div style={{ position: 'relative' }}>
                <LocationPinStyle index={index} active={active}>
                    <AirportShuttleIcon
                        style={{ color: active ? '#ffffff' : colors[index % 12] }}
                        fontSize={'medium'}
                    />
                </LocationPinStyle>
            </div>
        </Tooltip>
    );
};

export default React.memo(LocationBusPin);
