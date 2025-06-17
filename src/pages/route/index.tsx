import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import Title from '../../components/container/Title';
import { Button, Card, Col, Input, Modal, notification, Pagination, Radio, Row, Table, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import routeSlice, { RouteDataType } from '../../store/slice/route/route';
import { TablePaginationConfig } from 'antd/es/table/interface';
import { Link } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import { deleteRoute, getRouteAllList, getRouteList, orderSave } from '../../api/contents/busRoute/busRoute';
import routeDetailSlice from '../../store/slice/route/detail';
import { ObjectOption } from '../../api/type';
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    Droppable,
    DroppableProvided,
    DropResult,
} from 'react-beautiful-dnd';
import { InfoCircleOutlined } from '@ant-design/icons';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';

const RouteSetting = () => {
    const dispatch = useAppDispatch();
    const {
        column,
        tableData,
        total,
        routeOrderList,
        listLoading,
        listFailure,
        deleteLoading,
        deleteSuccess,
        deleteFailure,
        availCount,
        closeCount,
        totalCount,
        orderSaveLoading,
        orderSaveSuccess,
        orderSaveFailure,
    } = useAppSelector((state) => state.route);

    const [searchRadio, setSearchRadio] = useState('');
    const [searchText, onChangeSearchText] = useInput('');
    const [selectedRow, setSelectedRow] = useState<React.Key[]>([]);
    const [page, setPage] = useState<TablePaginationConfig>({ current: 1, pageSize: 10 });

    const [orderModal, setOrderModal] = useState<boolean>(false);
    const [orderList, setOrderList] = useState<ObjectOption[]>([]);

    useEffect(() => {
        dispatch(routeSlice.actions.resetState());
        dispatch(routeDetailSlice.actions.resetState());
        dispatch(getRouteList({ page: page.current, limit: page.pageSize }));
    }, []);

    const onChangeSearchRadio = useCallback(
        (e: any) => {
            const value = e.target.value;
            setSearchRadio(value);
            setSelectedRow([]);
            if (value === '') {
                if (searchText === '') {
                    dispatch(getRouteList({ page: 1, limit: page.pageSize }));
                } else {
                    dispatch(getRouteList({ page: 1, limit: page.pageSize, 'bus-route-name': searchText }));
                }
            } else {
                if (searchText === '') {
                    dispatch(getRouteList({ page: 1, limit: page.pageSize, 'bus-route-status': Number(value) }));
                } else {
                    dispatch(
                        getRouteList({
                            page: 1,
                            limit: page.pageSize,
                            'bus-route-name': searchText,
                            'bus-route-status': Number(value),
                        }),
                    );
                }
            }
            setPage({ ...page, current: 1 });
        },
        [searchRadio, searchText, selectedRow],
    );

    useEffect(() => {}, [searchRadio]);

    const onSearch = useCallback(() => {
        if (searchText === '') {
            dispatch(
                getRouteList({
                    page: 1,
                    limit: page.pageSize,
                }),
            );
            setSearchRadio('');
        } else {
            if (searchRadio !== '') {
                dispatch(
                    getRouteList({
                        page: 1,
                        limit: page.pageSize,
                        'bus-route-status': Number(searchRadio),
                        'bus-route-name': searchText,
                    }),
                );
            } else {
                dispatch(getRouteList({ page: 1, limit: page.pageSize, 'bus-route-name': searchText }));
            }
        }
        setPage({ ...page, current: 1 });
    }, [searchRadio, searchText]);

    const onSelectRow = useCallback(
        (key: React.Key[], row: RouteDataType[]) => {
            setSelectedRow(key);
        },
        [selectedRow],
    );

    const onChangePage = useCallback(
        (pagination: TablePaginationConfig) => {
            setPage(pagination);
            if (searchText === '' && searchRadio === '') {
                dispatch(getRouteList({ page: pagination.current, limit: pagination.pageSize }));
            } else if (searchText === '' && searchRadio !== '') {
                dispatch(
                    getRouteList({
                        page: pagination.current,
                        limit: pagination.pageSize,
                        'bus-route-status': Number(searchRadio),
                    }),
                );
            } else if (searchText !== '' && searchRadio === '') {
                dispatch(
                    getRouteList({
                        page: pagination.current,
                        limit: pagination.pageSize,
                        'bus-route-name': searchText,
                    }),
                );
            } else if (searchText !== '' && searchRadio !== '') {
                dispatch(
                    getRouteList({
                        page: pagination.current,
                        limit: pagination.pageSize,
                        'bus-route-name': searchText,
                        'bus-route-status': Number(searchRadio),
                    }),
                );
            }
        },
        [page, searchRadio, searchText],
    );

    const onDelete = useCallback(() => {
        if (selectedRow.length < 1) {
            notification['warning']({
                message: '삭제할 경로를 선택해 주세요.',
            });
            return;
        }
        dispatch(deleteRoute(Number(selectedRow[0])));
    }, [selectedRow]);

    const onOpenOrderModal = useCallback(() => {
        dispatch(getRouteAllList());
        setOrderModal(true);
    }, []);

    useEffect(() => {
        setOrderList(routeOrderList);
    }, [routeOrderList]);

    const onDragRoute = useCallback(
        (result: DropResult) => {
            if (!result.destination) return;

            const data: ObjectOption[] = [...orderList];
            const [reordered] = data.splice(result.source.index, 1);
            data.splice(result.destination.index, 0, reordered);
            const newData: ObjectOption[] = data.map((item, index) => item);

            setOrderList(newData);
        },
        [orderList],
    );

    const onSaveOrder = useCallback(() => {
        if (orderList.length < 1) {
            notification['warning']({
                message: (
                    <>
                        노선 순서 저장에 실패했습니다.
                        <br />
                        페이지 새로고침 후 다시 시도해 주세요.
                    </>
                ),
            });
            return;
        }
        const data: { bus_route_idx: number; bus_route_order: number }[] = orderList.map((item, index) => ({
            bus_route_idx: Number(item.value),
            bus_route_order: index + 1,
        }));

        dispatch(orderSave({ bus_route_order_list: data }));
    }, [orderList]);

    useEffect(() => {
        if (deleteSuccess) {
            notification['success']({ message: '삭제되었습니다.' });
            setSelectedRow([]);
            dispatch(getRouteList({ page: page.current, limit: page.pageSize }));
        }
        if (deleteFailure) {
            notification['warning']({ message: '삭제 실패했습니다.' });
        }
        if (listFailure) {
            notification['warning']({ message: '목록 조회에 실패했습니다.' });
        }
        if (orderSaveSuccess) {
            notification['success']({ message: '노선의 순서가 변경 되었습니다.' });
            setOrderModal(false);
            setOrderList([]);
            dispatch(getRouteList({ page: page.current, limit: page.pageSize }));
        }
        if (orderSaveFailure) {
            notification['warning']({ message: '노선 순서 변경에 실패했습니다.' });
        }
        dispatch(routeSlice.actions.changeInitState());
    }, [selectedRow, listFailure, deleteSuccess, deleteFailure, orderSaveSuccess, orderSaveFailure]);

    return (
        <AppLayout>
            <Title title={`Route`} subTitle={'버스 노선 관리'} />
            <Row gutter={[16, 16]} justify={'space-between'} style={{ marginBottom: '0.5rem' }}>
                <Col>
                    <Row gutter={[16, 16]}>
                        <Col>
                            <Radio.Group
                                buttonStyle="solid"
                                onChange={onChangeSearchRadio}
                                value={searchRadio}
                                size="large">
                                <Radio.Button value={''}>전체 경로 ({totalCount})</Radio.Button>
                                <Radio.Button value={'1'}>운행 ({availCount})</Radio.Button>
                                <Radio.Button value={'0'}>미운행 ({closeCount})</Radio.Button>
                            </Radio.Group>
                        </Col>
                        <Col>
                            <Input.Group compact>
                                <Input.Search
                                    size={'large'}
                                    value={searchText}
                                    onChange={onChangeSearchText}
                                    placeholder="노선명 Route Name"
                                    onSearch={onSearch}
                                />
                            </Input.Group>
                        </Col>
                    </Row>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                    <Button
                        size="large"
                        danger
                        style={{ marginRight: '0.5rem' }}
                        loading={deleteLoading}
                        onClick={onDelete}>
                        삭제
                    </Button>
                    <Button size="large" style={{ marginRight: '0.5rem' }} onClick={onOpenOrderModal}>
                        노선 순서 변경
                    </Button>
                    <Link to={`/route/create`}>
                        <Button size="large" type={'primary'}>
                            노선 추가
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Table
                rowKey={(item) => item.routeId}
                dataSource={tableData}
                rowSelection={{ type: 'radio', selectedRowKeys: selectedRow, onChange: onSelectRow }}
                pagination={{
                    current: page.current,
                    pageSize: page.pageSize,
                    total: total,
                }}
                onChange={onChangePage}
                loading={listLoading}
                footer={() => `total ${total}`}>
                {column?.map((col) => {
                    if (col.key === 'routeId') {
                        return (
                            <Table.Column
                                align={col.align}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record: RouteDataType) => (
                                    <Link to={`/route/${record.routeId}`}>
                                        <Button type={`link`}>#{record.routeId}</Button>
                                    </Link>
                                )}
                            />
                        );
                    }
                    if (col.key === 'busStopInfo') {
                        return (
                            <Table.Column
                                align={col.align}
                                width={'30%'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any) => <span style={{ wordBreak: 'break-word' }}>{_}</span>}
                            />
                        );
                    }
                    if (col.key === 'routeStatus') {
                        return (
                            <Table.Column
                                align={col.align}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record: RouteDataType) => (
                                    <Typography.Text type={_ === '1' ? 'success' : 'danger'}>
                                        {_ === '1' ? 'Available' : 'Closed'}
                                    </Typography.Text>
                                )}
                            />
                        );
                    }
                    return <Table.Column title={col.title} dataIndex={col.key} key={col.key} align={col.align} />;
                })}
            </Table>

            <Modal
                visible={orderModal}
                title={'노선 순서 변경'}
                width={400}
                onCancel={() => setOrderModal(false)}
                footer={[
                    <Button key="back" onClick={() => setOrderModal(false)}>
                        취소
                    </Button>,
                    <Button type="primary" loading={orderSaveLoading} onClick={onSaveOrder}>
                        저장
                    </Button>,
                ]}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                            <InfoCircleOutlined />
                            &nbsp; 드래그드랍으로 노선의 순서를 변경할 수 있습니다.
                        </Typography.Text>
                    </Col>
                    <DragDropContext onDragEnd={onDragRoute}>
                        <Droppable droppableId="route">
                            {(provided: DroppableProvided) => (
                                <Col
                                    span={24}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ maxHeight: '610px' }}>
                                    <PerfectScrollbar>
                                        {orderList.map((route, index) => (
                                            <Draggable key={index} draggableId={index.toString()} index={index}>
                                                {(provided: DraggableProvided) => (
                                                    <Card
                                                        key={route.value}
                                                        style={{ width: '100%' }}
                                                        ref={provided.innerRef}
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}>
                                                        {index + 1}. [{route.value}] {route.label}
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                    </PerfectScrollbar>
                                    {provided.placeholder}
                                </Col>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Row>
            </Modal>
        </AppLayout>
    );
};

export default RouteSetting;
