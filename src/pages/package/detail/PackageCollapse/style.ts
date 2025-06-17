import styled from 'styled-components';
import { Collapse } from 'antd';

export const PackageCollapsePanelStyle = styled(Collapse.Panel)`
    & .ant-collapse-header {
        align-items: center !important;
    }
    & .ant-collapse-content-box {
        padding: 2rem;
        padding-top: 1rem !important;
    }
`;
