import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import Title from '../../components/container/Title';
import { Button, Col, Input, Modal, notification, Row, Select, Table, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import { TablePaginationConfig } from 'antd/es/table/interface';
import { Link } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import bookingSlice, { BookingDataType } from '../../store/slice/booking/booking';
import { deleteBooking, getBookingList } from '../../api/contents/booking/booking';
import { BookingListRequest } from '../../api/contents/booking/bookingType';
import useInputValue from '../../hooks/useInputValue';
import { getStoreList } from '../../api/contents/store/store';
import { TableDataStyle, TableHeadStyle, TableStyle } from '../order/CancelModal/style';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Booking = () => {
    // 여행사&현지투어 예약 및 QR 생성 페이지
    const dispatch = useAppDispatch();
    const { storeOptionList } = useAppSelector((state) => state.store);
    const { column, tableData, total, deleteFailure, deleteLoading, deleteSuccess } = useAppSelector(
        (state) => state.booking,
    );

    const [searchUserName, onChangeSearchUserName] = useInput('');
    const [searchStoreIdx, onChangeSearchStoreIdx] = useInputValue<undefined | number>(undefined);
    const [selectedRow, setSelectedRow] = useState<React.Key[]>([]);
    const [searchParam, setSearchParam] = useState<BookingListRequest>({ page: 1, limit: 10, 'guest-yn': 'Y' });

    useEffect(() => {
        dispatch(bookingSlice.actions.resetState());
        dispatch(getStoreList({}));
        dispatch(getBookingList(searchParam));
    }, []);

    useEffect(() => {
        dispatch(getBookingList(searchParam));
    }, [searchParam]);

    const onSearch = useCallback(() => {
        let param: BookingListRequest = { page: 1, limit: 10, 'guest-yn': 'Y' };
        if (searchStoreIdx) {
            param['store-idx'] = searchStoreIdx;
        }
        if (searchUserName.trim() !== '') {
            param['user-name'] = searchUserName;
        }
        setSearchParam(param);
    }, [searchUserName, searchStoreIdx, searchParam]);

    const onSelectRow = useCallback(
        (key: React.Key[], row: BookingDataType[]) => {
            console.log('row', key, row);
            setSelectedRow(key);
        },
        [selectedRow],
    );

    const onDelete = useCallback(() => {
        if (selectedRow.length < 1) {
            notification['warning']({ message: '삭제할 항목을 선택해 주세요.' });
            return;
        }
        Modal.confirm({
            title: '선택된 예약을 삭제하시겠습니까?',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk() {
                const data: { booking_idx: number }[] = selectedRow.map((item) => {
                    return { booking_idx: Number(item) };
                });
                dispatch(deleteBooking({ ticket_list: data }));
            },
        });
    }, [selectedRow]);

    const rowSelection = {
        selectedRowKeys: selectedRow,
        onChange: onSelectRow,
    };

    const onChangePage = useCallback(
        (pagination: TablePaginationConfig) => {
            console.log('onChange', pagination);
            setSearchParam({ ...searchParam, page: pagination.current, limit: pagination.pageSize });
        },
        [searchParam],
    );

    const onOpenDetail = useCallback((record: BookingDataType) => {
        let qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(
            record.bookingToken,
        )}`;
        Modal.info({
            title: '예약내역 확인',
            width: 600,
            content: (
                <div style={{ marginLeft: '-38px' }}>
                    <Row gutter={[16, 16]}>
                        <Col span={24} style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <img src={qrUrl} alt="QR 코드" />
                        </Col>
                    </Row>
                    <TableStyle>
                        <tr>
                            <TableHeadStyle>예약 스토어</TableHeadStyle>
                            <TableDataStyle>{record.store}</TableDataStyle>
                        </tr>
                        <tr>
                            <TableHeadStyle>예약 상품</TableHeadStyle>
                            <TableDataStyle>{record.goodsName}</TableDataStyle>
                        </tr>
                        <tr>
                            <TableHeadStyle>예약 일시</TableHeadStyle>
                            <TableDataStyle>{record.bookingTime}</TableDataStyle>
                        </tr>
                        <tr>
                            <TableHeadStyle>예약자명</TableHeadStyle>
                            <TableDataStyle>{record.userName}</TableDataStyle>
                        </tr>
                        <tr>
                            <TableHeadStyle>
                                예약자
                                <br />
                                이메일/연락처
                            </TableHeadStyle>
                            <TableDataStyle>
                                {record.userInfo.user_email}
                                <br />
                                {record.userInfo.user_phone}
                            </TableDataStyle>
                        </tr>
                        <tr>
                            <TableHeadStyle>예약상태</TableHeadStyle>
                            <TableDataStyle>
                                {record.bookingStatus === '0'
                                    ? `이용가능`
                                    : record.bookingStatus === '1'
                                    ? `이용완료`
                                    : record.bookingStatus === '2'
                                    ? `취소완료`
                                    : record.bookingStatus === '3'
                                    ? `기간만료`
                                    : record.bookingStatus === '4'
                                    ? '결제대기'
                                    : '-'}
                            </TableDataStyle>
                        </tr>
                    </TableStyle>
                </div>
            ),
            okText: '확인',
            okType: 'default',
        });
    }, []);

    useEffect(() => {
        if (deleteSuccess) {
            notification['success']({ message: '선택 예약이 삭제되었습니다.' });
            dispatch(getBookingList(searchParam));
        }
        if (deleteFailure) {
            notification['warning']({ message: '삭제에 실패했습니다.' });
        }
        dispatch(bookingSlice.actions.changeInitState());
    }, [deleteSuccess, deleteFailure, searchParam]);

    return (
        <AppLayout>
            <Title title={`Booking`} subTitle={`일일 관광`} />
            <Row gutter={[16, 16]} align={'bottom'} justify={'space-between'} style={{ marginBottom: '0.5rem' }}>
                <Col span={18}>
                    <Row gutter={[16, 16]} align={'bottom'}>
                        <Col span={5}>
                            <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                스토어
                            </Typography.Text>
                            <Select
                                value={searchStoreIdx}
                                onChange={onChangeSearchStoreIdx}
                                placeholder={'스토어 선택 Store'}
                                size={'large'}
                                style={{ width: '100%' }}
                                allowClear>
                                {storeOptionList.map((item) => (
                                    <Select.Option key={item.value} value={item.value}>
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={5}>
                            <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                예약자명
                            </Typography.Text>
                            <Input
                                size={'large'}
                                value={searchUserName}
                                onChange={onChangeSearchUserName}
                                placeholder="예약자명 User name"
                                allowClear
                            />
                        </Col>
                        <Col>
                            <Button type={'primary'} size={'large'} onClick={onSearch}>
                                검색
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Button
                        size="large"
                        danger
                        style={{ marginLeft: '0.5rem' }}
                        loading={deleteLoading}
                        onClick={onDelete}>
                        예약 삭제
                    </Button>
                    <Link to={`/booking/create`}>
                        <Button size="large" type={'primary'} style={{ marginLeft: '0.5rem' }}>
                            예약생성
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Table
                rowKey={(item) => item.bookingId}
                dataSource={tableData}
                rowSelection={rowSelection}
                pagination={{ current: searchParam.page, pageSize: searchParam.limit, total: total }}
                onChange={onChangePage}
                footer={() => `total ${total}`}>
                {column?.map((col) => {
                    if (col.key === 'bookingId') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: number, record: BookingDataType) => (
                                    <Button type={`link`} onClick={() => onOpenDetail(record)}>
                                        #{record.bookingId}
                                    </Button>
                                )}
                            />
                        );
                    }
                    if (col.key === 'bookingToken') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                align={col.align}
                                render={(_: any, record) => (
                                    <img
                                        src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(
                                            _,
                                        )}`}
                                        alt={_}
                                        style={{ maxWidth: '60px' }}
                                    />
                                )}
                            />
                        );
                    }
                    if (col.key === 'bookingStatus') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record: BookingDataType) => (
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
                                                : { color: '#bfbfbf' }
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
                    return <Table.Column align={'center'} title={col.title} dataIndex={col.key} key={col.key} />;
                })}
            </Table>
        </AppLayout>
    );
};

export default Booking;
