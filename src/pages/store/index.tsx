import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import Title from '../../components/container/Title';
import { Button, Col, Input, notification, Radio, Row, Table, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import { TablePaginationConfig } from 'antd/es/table/interface';
import { Link } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import storeSlice, { StoreDataType } from '../../store/slice/store/store';
import { deleteStore, getStoreList } from '../../api/contents/store/store';
import storeDetailSlice from '../../store/slice/store/detail';

const Store = () => {
    const dispatch = useAppDispatch();
    const { column, tableData, total, deleteLoading, deleteSuccess, deleteFailure } = useAppSelector(
        (state) => state.store,
    );

    const [searchRadio, setSearchRadio] = useState('');
    const [searchText, onChangeSearchText] = useInput('');
    const [selectedRow, setSelectedRow] = useState<StoreDataType[]>([]);
    const [page, setPage] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    useEffect(() => {
        dispatch(storeSlice.actions.resetState());
        dispatch(storeDetailSlice.actions.resetState());
        dispatch(getStoreList({ page: page.current, limit: page.pageSize }));
    }, []);

    const onSearch = useCallback(() => {
        if (searchText === '') {
            dispatch(getStoreList({ page: 1, limit: page.pageSize }));
            setSearchRadio('');
        } else {
            if (searchRadio !== '') {
                dispatch(
                    getStoreList({ page: 1, limit: page.pageSize, 'store-name': searchText, 'biz-yn': searchRadio }),
                );
            } else {
                dispatch(getStoreList({ page: 1, limit: page.pageSize, 'store-name': searchText }));
            }
        }
        setPage({ ...page, current: 1 });
    }, [searchRadio, searchText]);

    const onChangeSearchRadio = useCallback(
        (e: any) => {
            const value = e.target.value;
            setSearchRadio(value);
            if (value === '') {
                if (searchText === '') {
                    dispatch(getStoreList({ page: 1, limit: page.pageSize }));
                } else {
                    dispatch(getStoreList({ page: 1, limit: page.pageSize, 'store-name': searchText }));
                }
            } else {
                if (searchText === '') {
                    dispatch(getStoreList({ page: 1, limit: page.pageSize, 'biz-yn': value }));
                } else {
                    dispatch(
                        getStoreList({ page: 1, limit: page.pageSize, 'store-name': searchText, 'biz-yn': value }),
                    );
                }
            }
        },
        [searchRadio, searchText],
    );

    const onSelectRow = useCallback(
        (key: React.Key[], row: StoreDataType[]) => {
            console.log('row', key, row);
            setSelectedRow(row);
        },
        [selectedRow],
    );

    const rowSelection = {
        selectedRow,
        onChange: onSelectRow,
    };

    const onChangePage = useCallback(
        (pagination: TablePaginationConfig) => {
            console.log('page', pagination);
            setPage(pagination);
            dispatch(getStoreList({ page: pagination.current, limit: pagination.pageSize }));
        },
        [page],
    );

    const onDeleteStore = useCallback(() => {
        if (selectedRow.length < 1) {
            notification['warning']({
                message: '삭제할 항목을 선택해 주세요.',
            });
            return;
        }
        const deleteStoreList = selectedRow.map((item) => item.storeId);
        dispatch(deleteStore({ delete_store_list: deleteStoreList }));
    }, [selectedRow]);

    useEffect(() => {
        if (deleteFailure) {
            notification['warning']({
                message: '삭제에 실패했습니다.',
            });
        }
        if (deleteSuccess) {
            notification['success']({
                message: '삭제되었습니다.',
            });
            dispatch(getStoreList({ page: page.current, limit: page.pageSize }));
        }
        dispatch(storeSlice.actions.changeInitState());
    }, [deleteFailure, deleteSuccess]);

    return (
        <AppLayout>
            <Title title={`Store`} subTitle={`스토어 관리`} />
            <Row gutter={[16, 16]} justify={'space-between'} style={{ marginBottom: '0.5rem' }}>
                <Col>
                    <Row gutter={[16, 16]}>
                        <Col>
                            <Input.Group compact>
                                <Input.Search
                                    placeholder={'가게명 Store Name'}
                                    size={'large'}
                                    value={searchText}
                                    onChange={onChangeSearchText}
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
                        onClick={onDeleteStore}>
                        스토어 삭제
                    </Button>
                    <Link to={`/store/create`}>
                        <Button size="large" type={'primary'}>
                            스토어 등록
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Table
                rowKey={(item) => item.storeId}
                dataSource={tableData}
                rowSelection={{ type: 'radio', ...rowSelection }}
                pagination={{ current: page.current, pageSize: page.pageSize, total: total }}
                onChange={onChangePage}
                footer={() => `total ${total}`}>
                {column?.map((col) => {
                    if (col.key === 'storeId') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record: StoreDataType) => (
                                    <Link to={`/store/${record.storeId}`}>
                                        <Button type={`link`}>#{record.storeId}</Button>
                                    </Link>
                                )}
                            />
                        );
                    }
                    if (col.key === 'storeInfo') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record: StoreDataType) => (
                                    <Typography.Text>
                                        {[..._]
                                            .map((item: string, index: number) => {
                                                if (item === '1') {
                                                    return ['일', '월', '화', '수', '목', '금', '토'][index];
                                                }
                                            })
                                            .filter((day) => day !== undefined)
                                            .toString()}
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

export default Store;
