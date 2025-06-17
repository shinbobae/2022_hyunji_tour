import React, { useEffect, useCallback } from 'react';
import { CaretRightOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Empty, Typography } from 'antd';
import { PackageCollapsePanelStyle } from './style';
import { PackageGoodsItem } from '../../../../api/contents/package/packageType';
import { useAppDispatch } from '../../../../hooks/useToolkit';
import { getGoodsType, getStoreCategory } from '../../../../api/contents/store/store';
import PackageCollapsePanel from './CollapsePanel';

type Props = {
    data: (PackageGoodsItem & { package_idx?: number })[];
    setData: React.Dispatch<React.SetStateAction<(PackageGoodsItem & { package_idx?: number })[]>>;
};
const PackageCollapse = ({ data, setData }: Props) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getStoreCategory());
        dispatch(getGoodsType());
    }, []);

    const onDelete = useCallback(
        (index: number) => () => {
            console.log('delete index', index);
            let newData: (PackageGoodsItem & { package_idx?: number })[] = [];
            data.forEach((item, index) => {
                newData[index] = { ...item };
            });
            newData.splice(index, 1);
            console.log('asdasd', newData);
            setData(newData);
        },
        [data],
    );

    if (data.length < 1) {
        return (
            <Card>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'설정된 패키지가 없습니다.'} />
            </Card>
        );
    }
    return (
        <Collapse
            bordered={false}
            defaultActiveKey={['0']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
            {data.map((item, index) => (
                <PackageCollapsePanelStyle
                    key={index}
                    header={
                        item.store_category_name !== '' ? (
                            <Typography.Title level={5} style={{ marginBottom: 0 }}>
                                {item.store_category_name}
                            </Typography.Title>
                        ) : (
                            <Typography.Text type="secondary">카테고리 선택</Typography.Text>
                        )
                    }
                    extra={
                        <div onClick={(e) => e.stopPropagation()}>
                            <Button size={'large'} type={'text'} icon={<DeleteOutlined />} onClick={onDelete(index)} />
                        </div>
                    }
                    className="site-collapse-custom-panel">
                    <PackageCollapsePanel key={index} index={index} dataList={data} data={item} setData={setData} />
                </PackageCollapsePanelStyle>
            ))}
        </Collapse>
    );
};

export default PackageCollapse;
