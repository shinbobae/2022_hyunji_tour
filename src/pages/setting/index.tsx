import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import Title from '../../components/container/Title';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import useInput from '../../hooks/useInput';
import { TablePaginationConfig } from 'antd/es/table/interface';
import { Button, Col, Input, Modal, notification, Radio, Row, Table, Typography } from 'antd';
import adminSettingSlice, { AdminSettingDataType } from '../../store/slice/adminSetting/adminSetting';
import { deleteManager, getManagerList, getManagerRoleList } from '../../api/contents/manage/manage';
import { Link } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getCommissionList, saveCommissionList } from '../../api/contents/commission/commission';
import { CommissionSaveItem } from '../../api/contents/commission/commissionType';
import commissionSlice from '../../store/slice/commission/commission';

const Setting = () => {
    const dispatch = useAppDispatch();
    const { column, tableData, total, loadingFailure, deleteLoading, deleteSuccess, deleteFailure, roleList } =
        useAppSelector((state) => state.adminSetting);
    const { commissionData, dataLoading, dataFailure, saveLoading, saveSuccess, saveFailure } = useAppSelector(
        (state) => state.commission,
    );

    const [commission1, onChangeCommission1, setCommission1] = useInput<number>(0);
    const [commission2, onChangeCommission2, setCommission2] = useInput(0);
    const [commission3, onChangeCommission3, setCommission3] = useInput(0);
    const [searchRadio, setSearchRadio] = useState(0);
    const [searchText, onChangeSearchText] = useInput('');
    const [selectedRow, setSelectedRow] = useState<React.Key[]>([]);
    const [page, setPage] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    useEffect(() => {
        dispatch(adminSettingSlice.actions.resetState());
        dispatch(commissionSlice.actions.resetState());
        dispatch(getManagerList({ page: page.current, limit: page.pageSize }));
        dispatch(getCommissionList());
        dispatch(getManagerRoleList());
    }, []);

    useEffect(() => {
        if (commissionData) {
            setCommission1(commissionData.find((item) => item.commission_seq_no === 1)?.commission || 0);
            setCommission2(commissionData.find((item) => item.commission_seq_no === 2)?.commission || 0);
            setCommission3(commissionData.find((item) => item.commission_seq_no === 3)?.commission || 0);
        }
    }, [commissionData]);

    const onSaveCommission = useCallback(() => {
        if (commission1.toString() === '' || commission2.toString() === '' || commission3.toString() === '') {
            notification['warning']({
                message: '모든 수수료를 입력해 주세요.',
            });
            return;
        }
        let data: CommissionSaveItem[] = [commission1, commission2, commission3].map((item, index) => {
            return {
                commission_seq_no: index + 1,
                commission: Number(item),
            };
        });
        dispatch(saveCommissionList({ commission_list: data }));
    }, [commission1, commission2, commission3]);

    const onSearch = useCallback(() => {
        if (searchRadio !== 0 && searchText !== '') {
            dispatch(
                getManagerList({
                    page: 1,
                    limit: page.pageSize,
                    'manager-name': searchText,
                    'manager-role-idx': searchRadio,
                }),
            );
        } else if (searchRadio !== 0 && searchText === '') {
            dispatch(
                getManagerList({
                    page: 1,
                    limit: page.pageSize,
                    'manager-role-idx': searchRadio,
                }),
            );
        } else if (searchRadio === 0 && searchText !== '') {
            dispatch(
                getManagerList({
                    page: 1,
                    limit: page.pageSize,
                    'manager-name': searchText,
                }),
            );
        } else if (searchRadio === 0 && searchText === '') {
            dispatch(getManagerList({ page: 1, limit: page.pageSize }));
        }
        setPage({ ...page, current: 1 });
    }, [searchText, searchRadio, page]);
    const onChangeSearchRadio = useCallback(
        (e: any) => {
            setSearchRadio(e.target.value);
            if (e.target.value !== 0 && searchText !== '') {
                dispatch(
                    getManagerList({
                        page: 1,
                        limit: page.pageSize,
                        'manager-name': searchText,
                        'manager-role-idx': e.target.value,
                    }),
                );
            } else if (e.target.value !== 0 && searchText === '') {
                dispatch(
                    getManagerList({
                        page: 1,
                        limit: page.pageSize,
                        'manager-role-idx': e.target.value,
                    }),
                );
            } else if (e.target.value === 0 && searchText !== '') {
                dispatch(
                    getManagerList({
                        page: 1,
                        limit: page.pageSize,
                        'manager-name': searchText,
                    }),
                );
            } else if (e.target.value === 0 && searchText === '') {
                dispatch(getManagerList({ page: 1, limit: page.pageSize }));
            }
            setPage({ ...page, current: 1 });
        },
        [searchRadio, searchText, page],
    );
    const onSelectRow = useCallback(
        (key: React.Key[], row: AdminSettingDataType[]) => {
            setSelectedRow(key);
        },
        [selectedRow],
    );
    const rowSelection = {
        selectedRow,
        onChange: onSelectRow,
    };
    const onChangePage = useCallback(
        (pagination: TablePaginationConfig) => {
            console.log('onChange', pagination);
            setPage(pagination);
            if (searchRadio !== 0 && searchText !== '') {
                dispatch(
                    getManagerList({
                        page: pagination.current,
                        limit: pagination.pageSize,
                        'manager-name': searchText,
                        'manager-role-idx': searchRadio,
                    }),
                );
            } else if (searchRadio !== 0 && searchText === '') {
                dispatch(
                    getManagerList({
                        page: pagination.current,
                        limit: pagination.pageSize,
                        'manager-role-idx': searchRadio,
                    }),
                );
            } else if (searchRadio === 0 && searchText !== '') {
                dispatch(
                    getManagerList({
                        page: pagination.current,
                        limit: pagination.pageSize,
                        'manager-name': searchText,
                    }),
                );
            } else if (searchRadio === 0 && searchText === '') {
                dispatch(getManagerList({ page: pagination.current, limit: pagination.pageSize }));
            }
        },
        [page, searchRadio, searchText],
    );

    const onDelete = useCallback(() => {
        if (selectedRow.length < 1) {
            notification['warning']({
                message: '삭제할 계정을 선택해 주세요.',
            });
            return;
        }
        Modal.confirm({
            title: '관리자 계정을 삭제하시겠습니까?',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onCancel() {
                console.log('cancel');
            },
            onOk() {
                dispatch(deleteManager(Number(selectedRow[0])));
            },
        });
    }, [selectedRow]);

    useEffect(() => {
        if (dataFailure) {
            notification['warning']({
                message: 'commission 정보 불러오기에 실패했습니다.',
            });
        }
        if (saveSuccess) {
            notification['success']({
                message: '저장되었습니다.',
            });
            dispatch(getCommissionList());
        }
        if (saveFailure) {
            notification['warning']({
                message: '저장에 실패했습니다.',
            });
        }
        dispatch(commissionSlice.actions.changeInitState());
    }, [dataFailure, saveSuccess, saveFailure]);

    useEffect(() => {
        if (loadingFailure) {
            notification['warning']({
                message: '목록 조회에 실패했습니다.',
            });
        }
        if (deleteSuccess) {
            notification['success']({
                message: '삭제되었습니다.',
            });
            dispatch(adminSettingSlice.actions.changeInitState());
            dispatch(getManagerList({ page: page.current, limit: page.pageSize }));
        }
        if (deleteFailure) {
            notification['warning']({
                message: '삭제 실패했습니다.',
            });
        }
    }, [loadingFailure, deleteSuccess, deleteFailure]);

    return (
        <AppLayout>
            <Title title={`Setting`} subTitle={`관리자 설정`} />
            <Row gutter={[16, 16]} align={'bottom'}>
                <Col span={24}>
                    <Typography.Title level={5}>Store Commission Setting</Typography.Title>
                </Col>
                <Col span={4}>
                    <Typography.Text type="secondary">1회 수수료</Typography.Text>
                    <Input
                        value={commission1}
                        onChange={(e) => {
                            const reg = /^-?\d*(\.\d*)?$/;
                            if (reg.test(e.target.value) && Number(e.target.value) <= 100) {
                                onChangeCommission1(e);
                            } else {
                                notification['warning']({
                                    key: 'alert',
                                    message: '100 이하의 숫자를 입력해 주세요.',
                                });
                            }
                        }}
                        placeholder="10"
                        suffix="%"
                    />
                </Col>
                <Col span={4}>
                    <Typography.Text type="secondary">2회 수수료</Typography.Text>
                    <Input
                        value={commission2}
                        onChange={(e) => {
                            const reg = /^-?\d*(\.\d*)?$/;
                            if (reg.test(e.target.value) && Number(e.target.value) <= 100) {
                                onChangeCommission2(e);
                            } else {
                                notification['warning']({
                                    key: 'alert',
                                    message: '100 이하의 숫자를 입력해 주세요.',
                                });
                            }
                        }}
                        placeholder="10"
                        suffix="%"
                    />
                </Col>
                <Col span={4}>
                    <Typography.Text type="secondary">3회 수수료</Typography.Text>
                    <Input
                        value={commission3}
                        onChange={(e) => {
                            const reg = /^-?\d*(\.\d*)?$/;
                            if (reg.test(e.target.value) && Number(e.target.value) <= 100) {
                                onChangeCommission3(e);
                            } else {
                                notification['warning']({
                                    key: 'alert',
                                    message: '100 이하의 숫자를 입력해 주세요.',
                                });
                            }
                        }}
                        placeholder="10"
                        suffix="%"
                    />
                </Col>
                <Col>
                    <Button type={'primary'} loading={saveLoading} onClick={onSaveCommission}>
                        저장
                    </Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]} justify={'space-between'} style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>
                <Col span={24}>
                    <Typography.Title level={5}>관리자 권한 설정</Typography.Title>
                </Col>
                <Col>
                    <Row gutter={[16, 16]}>
                        <Col>
                            <Radio.Group
                                buttonStyle="solid"
                                onChange={onChangeSearchRadio}
                                value={searchRadio}
                                size="large">
                                <Radio.Button value={0}>All</Radio.Button>
                                {roleList?.map((role) => (
                                    <Radio.Button key={role.value} value={role.value}>
                                        {role.label}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Col>
                        <Col>
                            <Input.Group compact>
                                <Input.Search
                                    size={'large'}
                                    value={searchText}
                                    placeholder={'관리자명 검색'}
                                    onChange={onChangeSearchText}
                                    onSearch={onSearch}
                                />
                            </Input.Group>
                        </Col>
                    </Row>
                </Col>
                <Col style={{ textAlign: 'right' }}>
                    <Button size="large" danger loading={deleteLoading} onClick={onDelete}>
                        삭제
                    </Button>
                    <Link to={`/setting/create`}>
                        <Button size="large" type="primary" style={{ marginLeft: '0.5rem' }}>
                            계정 등록
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Table
                rowKey={(item) => item.adminIdx}
                dataSource={tableData}
                rowSelection={{ type: 'radio', ...rowSelection }}
                pagination={{
                    current: page.current,
                    pageSize: page.pageSize,
                    total: total,
                }}
                onChange={onChangePage}
                footer={() => `total ${total}`}>
                {column?.map((col) => {
                    if (col.key === 'adminStatus') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any) => (
                                    <Typography.Text type={_ === 'N' ? 'success' : 'danger'}>
                                        {_ === 'N' ? '활성화' : '비활성화'}
                                    </Typography.Text>
                                )}
                            />
                        );
                    }
                    if (col.key === 'adminName') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record: AdminSettingDataType) => (
                                    <Link to={`/setting/${record.adminIdx}`}>
                                        <Button type={`link`}>{_}</Button>
                                    </Link>
                                )}
                            />
                        );
                    }
                    if (col.key === 'adminStatus') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any) => (
                                    <Typography.Text type={_ === 'N' ? 'success' : 'danger'}>
                                        {_ === 'N' ? '활성화' : '비활성화'}
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

export default Setting;
