import React from 'react';
import { BookingInfoItem } from '../../../api/contents/order/orderType';
import { Badge, Col, Row, Table, Tag, Typography } from 'antd';
import { useAppSelector } from '../../../hooks/useToolkit';
const colors = [
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
type Props = {
    data: BookingInfoItem[];
};
const BookingExpandTable = ({ data }: Props) => {
    const { expandColumn } = useAppSelector((state) => state.order);
    return (
        <Table bordered={true} dataSource={data} pagination={false}>
            {expandColumn.map((col) => {
                if (col.key === 'booking_date') {
                    return (
                        <Table.Column
                            title={col.title}
                            dataIndex={col.key}
                            key={col.key}
                            width={col.width}
                            render={(_: any, record) => (
                                <Typography.Text>
                                    {record.booking_date_from} ~ {record.booking_date_to}
                                    {/*{record.store_idx === 1 && <> ~ {record.booking_date_to}</>}*/}
                                </Typography.Text>
                            )}
                        />
                    );
                }
                if (col.key === 'store_name') {
                    return (
                        <Table.Column
                            title={col.title}
                            dataIndex={col.key}
                            key={col.key}
                            width={col.width}
                            render={(_: any, record, index) => {
                                return (
                                    <Tag>
                                        {record.store_category_name}/{record.store_name}
                                    </Tag>
                                );
                            }}
                        />
                    );
                }
                if (col.key === 'goods_name') {
                    return (
                        <Table.Column
                            title={col.title}
                            dataIndex={col.key}
                            key={col.key}
                            width={col.width}
                            render={(_: any, record, index) => {
                                return (
                                    <Typography.Text>
                                        <Badge color={colors[record.store_category_idx]} text={_} />
                                    </Typography.Text>
                                );
                            }}
                        />
                    );
                }
                if (col.key === 'booking_status') {
                    return (
                        <Table.Column
                            align={'center'}
                            title={col.title}
                            dataIndex={col.key}
                            key={col.key}
                            width={col.width}
                            render={(_: any) => (
                                <Typography.Text
                                    style={
                                        _ === '0'
                                            ? { color: '#73d13d' }
                                            : _ === '1'
                                            ? { color: '#40a9ff' }
                                            : _ === '2'
                                            ? { color: '#ffa940' }
                                            : _ === '3'
                                            ? { color: '#ff4d4f' }
                                            : undefined
                                    }>
                                    {_ === '0'
                                        ? `이용가능`
                                        : _ === '1'
                                        ? `이용완료`
                                        : _ === '2'
                                        ? `취소완료`
                                        : _ === '3'
                                        ? `기간만료`
                                        : _ === '4'
                                        ? '결제대기'
                                        : '-'}
                                </Typography.Text>
                            )}
                        />
                    );
                }
                return <Table.Column title={col.title} dataIndex={col.key} key={col.key} />;
            })}
        </Table>
    );
};

export default BookingExpandTable;
