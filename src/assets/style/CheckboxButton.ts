import styled from 'styled-components';
import { Checkbox } from 'antd';

export const CheckboxButton = styled(Checkbox)<{ checked: boolean }>`
    position: relative;
    margin-left: 0 !important;
    width: 60px;
    height: 40px;

    & .ant-checkbox {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        & ~ span {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            width: 100%;
            height: 100%;
            color: ${(props) => props.checked && `#ffffff`};
            text-align: center;
        }
    }

    & .ant-checkbox-inner {
        width: 100%;
        height: 100%;

        &:after {
            display: none;
        }
    }

    &:after {
        display: none;
    }
`;

export const CheckboxToggle = styled(Checkbox)<{ checked: boolean }>`
    & .ant-checkbox {
        display: none;
    }

    & .ant-checkbox-inner {
        width: 100%;
        height: 100%;

        &:after {
            display: none;
        }
    }
    &:after {
        display: none;
    }
`;
