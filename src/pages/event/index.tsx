import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import Title from '../../components/container/Title';
import { Button, Col, Modal, notification, Row, Table, Typography } from 'antd';
import { EventListRequest } from '../../api/contents/event/eventType';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import { TablePaginationConfig } from 'antd/es/table/interface';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteEvent, getEventList } from '../../api/contents/event/event';
import eventSlice, { EventDataType } from '../../store/slice/event/event';
import { Link } from 'react-router-dom';

const Event = () => {
    const dispatch = useAppDispatch();
    const { column, tableData, total, listLoading, listFailure, deleteLoading, deleteFailure, deleteSuccess } =
        useAppSelector((state) => state.event);

    const [selectedRow, setSelectedRow] = useState<React.Key[]>([]);
    const [searchParam, setSearchParam] = useState<EventListRequest>({ page: 1, limit: 10 });

    useEffect(() => {
        dispatch(eventSlice.actions.resetState());
        dispatch(getEventList(searchParam));
    }, []);

    const onSelectRow = useCallback(
        (key: React.Key[], row: EventDataType[]) => {
            console.log('row', key, row);
            setSelectedRow(key);
        },
        [selectedRow],
    );

    const onChangePage = useCallback(
        (pagination: TablePaginationConfig) => {
            setSelectedRow([]);
            setSearchParam({ ...searchParam, page: pagination.current, limit: pagination.pageSize });
        },
        [searchParam],
    );

    const onDelete = useCallback(() => {
        if (selectedRow.length < 1) {
            notification['warning']({
                message: '삭제할 항목을 선택해 주세요.',
            });
            return;
        }
        Modal.confirm({
            title: '선택된 이벤트를 삭제하시겠습니까?',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk() {
                const data: number[] = selectedRow.map((item) => {
                    return Number(item);
                });
                dispatch(deleteEvent({ event_idx_list: data }));
            },
        });
    }, [selectedRow]);

    useEffect(() => {
        if (listFailure) {
            notification['warning']({
                message: '목록 조회에 실패했습니다.',
            });
        }
        if (deleteFailure) {
            notification['warning']({
                message: '삭제에 실패했습니다.',
            });
        }
        if (deleteSuccess) {
            notification['success']({
                message: '삭제되었습니다.',
            });
            setSelectedRow([]);
            dispatch(getEventList(searchParam));
        }
        dispatch(eventSlice.actions.changeInitState());
    }, [searchParam, listFailure, deleteFailure, deleteSuccess]);

    return (
        <AppLayout>
            <Title title={`Event`} subTitle={`이벤트 팝업 관리`} />
            <Row gutter={[8, 8]} justify={'end'} style={{ marginBottom: '0.5rem' }}>
                <Col span={6} style={{ textAlign: 'right' }}>
                    <Button size="large" danger loading={deleteLoading} onClick={onDelete}>
                        삭제
                    </Button>
                    <Link to={`/event/create`} style={{ marginLeft: '0.5rem' }}>
                        <Button size="large" type={'primary'} style={{ marginLeft: '0.5rem' }}>
                            이벤트 추가
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Table
                rowKey={(item: EventDataType) => item.eventIdx}
                dataSource={tableData}
                rowSelection={{ type: 'checkbox', selectedRowKeys: selectedRow, onChange: onSelectRow }}
                pagination={{ current: searchParam.page, pageSize: searchParam.limit, total: total }}
                onChange={onChangePage}
                loading={listLoading}
                footer={() => `total ${total}`}>
                {column?.map((col) => {
                    if (col.key === 'eventIdx') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record) => (
                                    <Link to={`/event/${_}`} state={record}>
                                        <Button type={`link`}>
                                            [{_}] {record.buttonText}
                                        </Button>
                                    </Link>
                                )}
                            />
                        );
                    }
                    if (col.key === 'imageUrl') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record) => {
                                    if (_ === '') {
                                        return '-';
                                    } else {
                                        return (
                                            <img
                                                src={_}
                                                alt={`${record.eventIdx} 이미지`}
                                                style={{
                                                    display: 'inline-block',
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    maxHeight: '150px',
                                                }}
                                            />
                                        );
                                    }
                                }}
                            />
                        );
                    }
                    if (col.key === 'useYn') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                align={col.align}
                                key={col.key}
                                render={(_: any) => (
                                    <Typography.Text type={_ === 'N' ? 'danger' : 'success'}>
                                        {_ === 'N' ? '미사용' : '사용'}
                                    </Typography.Text>
                                )}
                            />
                        );
                    }
                    return <Table.Column align={'center'} title={col.title} dataIndex={col.key} key={col.key} />;
                })}
            </Table>
        </AppLayout>
    );
};

export default Event;
