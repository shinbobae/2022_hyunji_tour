import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import Title from '../../components/container/Title';
import { Button, Col, Modal, notification, Row, Table, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import IssueTicket from './IssueTicket';
import { TablePaginationConfig } from 'antd/es/table/interface';
import ticketSlice, { TicketDataType } from '../../store/slice/ticket/ticket';
import { deleteTicket, getTicketBookingList } from '../../api/contents/ticket/ticket';
import { BookingListRequest } from '../../api/contents/booking/bookingType';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Ticket = () => {
    const dispatch = useAppDispatch();
    const {
        column,
        tableData,
        total,
        listLoading,
        listFailure,
        deleteLoading,
        deleteSuccess,
        deleteFailure,
        saveSuccess,
    } = useAppSelector((state) => state.ticket);

    const [selectedRow, setSelectedRow] = useState<React.Key[]>([]);
    const [searchParam, setSearchParam] = useState<BookingListRequest>({ page: 1, limit: 10, 'user-name': '현지투어' });

    useEffect(() => {
        dispatch(ticketSlice.actions.resetState());
        dispatch(getTicketBookingList(searchParam));
    }, []);

    const onDelete = useCallback(() => {
        if (selectedRow.length < 1) {
            notification['warning']({ message: '삭제할 항목을 선택해 주세요.' });
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
                const data: { booking_idx: number }[] = selectedRow.map((item) => {
                    return { booking_idx: Number(item) };
                });
                dispatch(deleteTicket({ ticket_list: data }));
            },
        });
    }, [selectedRow]);

    const onChangePage = useCallback(
        (pagination: TablePaginationConfig) => {
            setSelectedRow([]);
            setSearchParam({ ...searchParam, page: pagination.current, limit: pagination.pageSize });
        },
        [searchParam],
    );

    const onSelectRow = useCallback(
        (key: React.Key[], row: TicketDataType[]) => {
            setSelectedRow(key);
        },
        [selectedRow],
    );

    const onOpenQrModal = useCallback((token: string) => {
        let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${token}`;
        Modal.info({
            title: 'QR CODE',
            content: (
                <Row gutter={[16, 16]}>
                    <Col span={24} style={{ marginTop: '2rem' }}>
                        <img src={qrUrl} alt="QR 코드" />
                    </Col>
                </Row>
            ),
            okText: '확인',
            okType: 'default',
        });
    }, []);

    useEffect(() => {
        if (listFailure) {
            notification['warning']({ message: '목록 조회에 실패했습니다.' });
        }
        if (deleteSuccess) {
            notification['success']({ message: '선택 티켓이 삭제되었습니다.' });
            dispatch(getTicketBookingList(searchParam));
        }
        if (deleteFailure) {
            notification['warning']({ message: '삭제에 실패했습니다.' });
        }
        if (saveSuccess) {
            notification['success']({
                message: 'QR이 생성되었습니다.',
            });
            dispatch(getTicketBookingList(searchParam));
        }
        dispatch(ticketSlice.actions.changeInitState());
    }, [listFailure, deleteSuccess, deleteFailure, saveSuccess]);

    return (
        <AppLayout>
            <Title title={'Ticket'} subTitle={`무료 티켓 관리`} />
            <Row gutter={[8, 8]} justify={'end'} style={{ marginBottom: '0.5rem' }}>
                <Col span={24}>
                    <IssueTicket />
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                    <Button size="large" danger loading={deleteLoading} onClick={onDelete}>
                        삭제
                    </Button>
                </Col>
            </Row>
            <Table
                rowKey={(item: TicketDataType) => item.ticketIdx}
                dataSource={tableData}
                pagination={{ current: searchParam.page, pageSize: searchParam.limit, total: total }}
                rowSelection={{ type: 'checkbox', selectedRowKeys: selectedRow, onChange: onSelectRow }}
                onChange={onChangePage}
                loading={listLoading}
                footer={() => `total ${total}`}>
                {column?.map((col) => {
                    if (col.key === 'ticketIdx') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                align={col.align}
                                render={(_: any, record) => (
                                    <Button type={`link`} onClick={() => onOpenQrModal(_)}>
                                        [{_}]
                                    </Button>
                                )}
                            />
                        );
                    }
                    if (col.key === 'ticketToken') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                align={col.align}
                                render={(_: any, record) => (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${_}`}
                                        alt={_}
                                        style={{ maxWidth: '60px' }}
                                    />
                                )}
                            />
                        );
                    }
                    if (col.key === 'validity') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                align={col.align}
                                render={(_: any, record) => (
                                    // 0: 기간 전, 1: 사용가능기간, 2: 기간만료
                                    <Typography.Text type={_ === '0' ? 'warning' : _ === '1' ? 'success' : 'warning'}>
                                        {_ === '0' ? '사용기간 전' : _ === '1' ? '사용가능' : '기간만료'}
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

export default Ticket;
