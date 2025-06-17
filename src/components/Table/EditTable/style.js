import styled from 'styled-components';

export const TableWrapStyle = styled.div`
    & .ant-table table {
        border-collapse: collapse;

        & tr.drop-over-downward td {
            border-bottom: 2px dashed #1890ff;
        }
        & tr.drop-over-upward td {
            border-top: 2px dashed #1890ff;
        }
    }
`;
