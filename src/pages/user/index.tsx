import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import Title from '../../components/container/Title';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import useInput from '../../hooks/useInput';
import { TablePaginationConfig } from 'antd/es/table/interface';
import { Button, Col, Input, Modal, notification, Radio, Row, Table, Typography } from 'antd';
import userSettingSlice, { UserSettingDataType } from '../../store/slice/userSetting/userSetting';
import { deleteUserList, getUserList } from '../../api/contents/user/user';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getRouteList } from '../../api/contents/busRoute/busRoute';

const User = () => {
    const dispatch = useAppDispatch();
    const { column, tableData, total, listLoading, listFailure, deleteLoading, deleteSuccess, deleteFailure } =
        useAppSelector((state) => state.userSetting);

    const [searchRadio, onChangeSearchRadio] = useInput('all');
    const [searchText, onChangeSearchText] = useInput('');
    const [selectedRow, setSelectedRow] = useState<React.Key[]>([]);
    const [page, setPage] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    useEffect(() => {
        dispatch(userSettingSlice.actions.resetState());
        dispatch(getUserList({ page: page.current, limit: page.pageSize }));
    }, []);

    const onSearch = useCallback(() => {
        if (searchText === '') {
            dispatch(getUserList({ page: 1, limit: page.pageSize }));
        } else {
            dispatch(getUserList({ page: 1, limit: page.pageSize, 'user-name': searchText }));
        }
        setPage({ ...page, current: 1 });
    }, [searchText]);

    const onSelectRow = useCallback(
        (key: React.Key[], row: UserSettingDataType[]) => {
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
            console.log('onChange', pagination);
            setPage(pagination);
            if (searchText === '') {
                dispatch(getUserList({ page: pagination.current, limit: pagination.pageSize }));
            } else {
                dispatch(
                    getUserList({ page: pagination.current, limit: pagination.pageSize, 'user-name': searchText }),
                );
            }
        },
        [page, searchText],
    );

    const onDeleteUser = useCallback(() => {
        if (selectedRow.length < 1) {
            notification['warning']({
                message: '탈퇴처리 할 계정을 선택해 주세요.',
            });
        }
        Modal.confirm({
            title: '사용자 계정을 탈퇴처리 하시겠습니까?',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            okText: '탈퇴',
            okType: 'danger',
            cancelText: '취소',
            onCancel() {
                console.log('cancel');
            },
            onOk() {
                const data = selectedRow.map((item) => Number(item));
                dispatch(deleteUserList({ delete_user_list: data }));
            },
        });
    }, [selectedRow]);

    useEffect(() => {
        if (deleteSuccess) {
            notification['success']({
                message: '삭제되었습니다.',
            });
            setSelectedRow([]);
            dispatch(getRouteList({ page: page.current, limit: page.pageSize }));
        }
        if (deleteFailure) {
            notification['warning']({
                message: '삭제 실패했습니다.',
            });
        }
        if (listFailure) {
            notification['warning']({
                message: '목록 조회에 실패했습니다.',
            });
        }
        dispatch(userSettingSlice.actions.changeInitState());
    }, [selectedRow, listFailure, deleteSuccess, deleteFailure]);

    return (
        <AppLayout>
            <Title title={`User`} subTitle={`사용자 관리`} />
            <Row gutter={[16, 16]} justify={'space-between'} style={{ marginBottom: '0.5rem' }}>
                <Col>
                    <Input.Group compact>
                        <Input.Search
                            placeholder={'이름 User Name'}
                            size={'large'}
                            value={searchText}
                            onChange={onChangeSearchText}
                            onSearch={onSearch}
                        />
                    </Input.Group>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                    <Button size="large" danger loading={deleteLoading} onClick={onDeleteUser}>
                        선택 탈퇴
                    </Button>
                </Col>
            </Row>
            <Table
                rowKey={(item) => item.key}
                dataSource={tableData}
                rowSelection={rowSelection}
                pagination={{ current: page.current, pageSize: page.pageSize, total: total }}
                onChange={onChangePage}
                loading={listLoading}
                footer={() => `total ${total}`}>
                {column?.map((col) => {
                    if (col.key === 'userName') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record) => {
                                    if (record.userStatus === 'N') {
                                        return <Typography.Text>{_}</Typography.Text>;
                                    } else {
                                        return <Typography.Text>{_}</Typography.Text>;
                                    }
                                }}
                            />
                        );
                    }
                    if (col.key === 'userStatus') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                align={col.align}
                                key={col.key}
                                render={(_: any) => (
                                    <Typography.Text type={_ === 'N' ? 'success' : 'danger'}>
                                        {_ === 'N' ? '사용' : '탈퇴'}
                                    </Typography.Text>
                                )}
                            />
                        );
                    }
                    return <Table.Column title={col.title} dataIndex={col.key} key={col.key} />;
                })}
            </Table>
        </AppLayout>
    );
};

export default User;
