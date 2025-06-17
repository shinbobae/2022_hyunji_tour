import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import Title from '../../components/container/Title';
import { Button, Col, Input, Modal, notification, Radio, Row, Table, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import { TablePaginationConfig } from 'antd/es/table/interface';
import useInput from '../../hooks/useInput';
import busSlice, { BusDataType } from '../../store/slice/bus/bus';
import BusDetailModal from './BusDetailModal';
import { deleteBus, getBusList } from '../../api/contents/bus/bus';
import { BusDeleteItem, BusDeleteRequest } from '../../api/contents/bus/busType';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const BusSetting = () => {
    const dispatch = useAppDispatch();
    const {
        column,
        tableData,
        total,
        modalMode,
        listLoading,
        listFailure,
        deleteLoading,
        deleteSuccess,
        deleteFailure,
    } = useAppSelector((state) => state.bus);

    const [searchRadio, onChangeSearchRadio] = useInput('all');
    const [searchText, onChangeSearchText] = useInput('');
    const [selectedRow, setSelectedRow] = useState<React.Key[]>([]);
    const [currentBus, setCurrentBus] = useState<BusDataType>();
    const [page, setPage] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    useEffect(() => {
        dispatch(busSlice.actions.resetState());
        dispatch(getBusList({ page: page.current, limit: page.pageSize }));
    }, []);

    useEffect(() => {
        if (modalMode === 'save') {
            dispatch(getBusList({ page: page.current, limit: page.pageSize }));
            dispatch(busSlice.actions.changeModalMode(''));
        }
    }, [modalMode]);

    const onSearch = useCallback(() => {
        if (searchText === '') {
            notification['warning']({
                message: '검색어를 입력해 주세요',
            });
            return;
        }
        console.log('검색!', searchText);
    }, [searchText]);

    const onSelectRow = useCallback(
        (key: React.Key[], row: BusDataType[]) => {
            console.log('row', key, row);
            setSelectedRow(key);
        },
        [selectedRow],
    );

    const rowSelection = {
        selectedRowKeys: selectedRow,
        onChange: onSelectRow,
    };

    const onChangePage = useCallback(
        (pagination: TablePaginationConfig) => {
            setPage(pagination);
            dispatch(getBusList({ page: pagination.current, limit: pagination.pageSize }));
        },
        [page],
    );

    const onCreateBus = useCallback(() => {
        dispatch(busSlice.actions.changeModalMode('create'));
    }, []);

    const onDeleteBus = useCallback(() => {
        if (selectedRow.length < 1) {
            notification['warning']({
                message: '삭제할 버스를 선택해 주세요.',
            });
            return;
        }
        Modal.confirm({
            title: '선택된 버스를 삭제하시겠습니까?',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk() {
                const data: BusDeleteItem[] = selectedRow.map((item) => {
                    return { bus_idx: Number(item) };
                });
                dispatch(deleteBus({ bus_list: data }));
            },
        });
    }, [selectedRow]);

    useEffect(() => {
        if (listFailure) {
            notification['warning']({
                message: '목록 조회에 실패했습니다.',
            });
        }
        if (deleteSuccess) {
            notification['success']({
                message: '삭제되었습니다.',
            });
            dispatch(getBusList({ page: page.current, limit: page.pageSize }));
            setSelectedRow([]);
        }
        if (deleteFailure) {
            notification['warning']({
                message: '삭제에 실패했습니다.',
            });
        }
        dispatch(busSlice.actions.changeInitState());
    }, [listFailure, deleteSuccess, deleteFailure]);

    const onOpenDetail = useCallback(
        (data: BusDataType) => {
            setCurrentBus(data);
            dispatch(busSlice.actions.changeModalMode('detail'));
        },
        [currentBus, modalMode],
    );

    return (
        <AppLayout>
            <Title title={`Bus`} subTitle={'버스 관리'} />
            <Row gutter={[16, 16]} style={{ marginBottom: '0.5rem' }}>
                <Col span={6} offset={18} style={{ textAlign: 'right' }}>
                    <Button size="large" danger loading={deleteLoading} onClick={onDeleteBus}>
                        삭제
                    </Button>
                    <Button size="large" type={'primary'} onClick={onCreateBus} style={{ marginLeft: '0.5rem' }}>
                        버스 등록
                    </Button>
                </Col>
            </Row>
            <Table
                rowKey={(item) => item.busId}
                dataSource={tableData}
                rowSelection={rowSelection}
                pagination={{ current: page.current, pageSize: page.pageSize, total: total }}
                onChange={onChangePage}
                loading={listLoading}
                footer={() => `total ${total}`}>
                {column?.map((col) => {
                    if (col.key === 'busId') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record: BusDataType) => (
                                    <Button type={`link`} onClick={() => onOpenDetail(record)}>
                                        #{_}
                                    </Button>
                                )}
                            />
                        );
                    }
                    if (col.key === 'busStatus') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record: BusDataType) => (
                                    <Typography.Text type={_ === 'Y' ? 'success' : 'danger'}>
                                        {_ === 'Y' ? `운행` : `미운행`}
                                    </Typography.Text>
                                )}
                            />
                        );
                    }
                    return <Table.Column align={'center'} title={col.title} dataIndex={col.key} key={col.key} />;
                })}
            </Table>
            {modalMode !== '' && <BusDetailModal currentBus={modalMode === 'detail' ? currentBus : null} />}
        </AppLayout>
    );
};

export default BusSetting;
