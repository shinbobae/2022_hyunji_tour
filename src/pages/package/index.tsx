import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import Title from '../../components/container/Title';
import { Button, Col, Input, Modal, notification, Radio, Row, Table, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import { TablePaginationConfig } from 'antd/es/table/interface';
import useInput from '../../hooks/useInput';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import packageSlice, { PackageDataType } from '../../store/slice/package/package';
import { Link } from 'react-router-dom';
import { PackageListRequest } from '../../api/contents/package/packageType';
import { deletePackage, getPackageList } from '../../api/contents/package/package';

const Package = () => {
    const dispatch = useAppDispatch();
    const { column, tableData, total, listLoading, listFailure, deleteLoading, deleteSuccess, deleteFailure } =
        useAppSelector((state) => state.package);

    const [searchRadio, onChangeSearchRadio] = useInput('all');
    const [searchText, onChangeSearchText] = useInput('');
    const [selectedRow, setSelectedRow] = useState<React.Key[]>([]);

    const [searchParam, setSearchParam] = useState<PackageListRequest>({ page: 1, limit: 10 });

    useEffect(() => {
        dispatch(packageSlice.actions.resetState());
    }, []);

    useEffect(() => {
        dispatch(getPackageList(searchParam));
    }, [searchParam]);

    const onSearch = useCallback(() => {
        let param: PackageListRequest = { page: 1, limit: 10 };
        if (searchText.trim() !== '') {
            param['package-name'] = searchText;
        }
        setSearchParam(param);
    }, [searchText, searchParam]);

    const onSelectRow = useCallback(
        (key: React.Key[], row: PackageDataType[]) => {
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
                message: '예약 및 결제를 취소할 항목을 선택해 주세요.',
            });
            return;
        }
        Modal.confirm({
            title: '선택된 패키지를 삭제하시겠습니까?',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk() {
                const data: number[] = selectedRow.map((item) => {
                    return Number(item);
                });
                dispatch(deletePackage(data[0]));
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
            setSelectedRow([]);
            dispatch(getPackageList(searchParam));
        }
        if (deleteFailure) {
            notification['warning']({
                message: '삭제에 실패했습니다.',
            });
        }
        dispatch(packageSlice.actions.changeInitState());
    }, [searchParam, listFailure, deleteSuccess, deleteFailure]);

    return (
        <AppLayout>
            <Title title={`Package`} subTitle={`패키지 관리`} />
            <Row gutter={[16, 16]} justify={'space-between'} style={{ marginBottom: '0.5rem' }}>
                <Col md={8}>
                    <Input.Group compact>
                        <Input.Search
                            value={searchText}
                            onChange={onChangeSearchText}
                            onSearch={onSearch}
                            placeholder={'패키지명 Package Name'}
                            allowClear
                            size={'large'}
                        />
                    </Input.Group>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                    <Button size="large" danger loading={deleteLoading} onClick={onDelete}>
                        삭제
                    </Button>
                    <Link to={`/package/create`} style={{ marginLeft: '0.5rem' }}>
                        <Button size="large" type={'primary'}>
                            패키지 추가
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Table
                rowKey={(item: PackageDataType) => item.packageIdx}
                dataSource={tableData}
                rowSelection={{ type: 'radio', selectedRowKeys: selectedRow, onChange: onSelectRow }}
                pagination={{ current: searchParam.page, pageSize: searchParam.limit, total: total }}
                onChange={onChangePage}
                loading={listLoading}
                footer={() => `total ${total}`}>
                {column?.map((col) => {
                    if (col.key === 'packageName') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record) => (
                                    <Link to={`/package/${record.packageIdx}`} state={record.packageIdx}>
                                        <Button type={`link`}>{_}</Button>
                                    </Link>
                                )}
                            />
                        );
                    }
                    if (col.key === 'packageImageUrl') {
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
                                                alt={`${record.packageName} 이미지`}
                                                style={{
                                                    display: 'inline-block',
                                                    width: '100%',
                                                    maxWidth: '200px',
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
                    return <Table.Column align={'center'} title={col.title} dataIndex={col.key} key={col.key} />;
                })}
            </Table>
        </AppLayout>
    );
};

export default Package;
