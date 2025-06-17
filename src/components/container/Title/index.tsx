import React from 'react';
import { PageHeader } from 'antd';

interface Props {
    title: string;
    subTitle?: string;
}

const PageTitle = ({ title, subTitle }: Props) => {
    return (
        <PageHeader
            className="site-page-header"
            style={{ width: 'auto', padding: '28px 0', zIndex: 2 }}
            //onBack={() => null}
            backIcon={false}
            title={title}
            subTitle={subTitle}
        />
    );
};
export default PageTitle;
