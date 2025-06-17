import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import Title from '../../components/container/Title';
import { Button, Col, DatePicker, Input, notification, Row, Select, Table, Tag, TimePicker, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import { SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import useInput from '../../hooks/useInput';
import orderSlice, { OrderDataType } from '../../store/slice/order/order';
import { getOrderCSV, getOrderList } from '../../api/contents/order/order';
import { BookingInfoItem, OrderCsvRequest, OrderListRequest } from '../../api/contents/order/orderType';
import { getStoreList } from '../../api/contents/store/store';
import useInputValue from '../../hooks/useInputValue';
import moment from 'moment-timezone';
import DetailModal from './DetailModal';
import CancelModal from './CancelModal';
import { DownOutlined, FileExcelOutlined, UpOutlined } from '@ant-design/icons';
import BookingExpandTable from './BookingExpandTable';
import type { TableProps } from 'antd/es/table';
const Order = () => {
    const dispatch = useAppDispatch();
    const {
        column,
        expandColumn,
        tableData,
        total,
        listLoading,
        listFailure,
        deleteSuccess,
        downloadLoading,
        downloadSuccess,
        downloadFailure,
        downloadLink,
    } = useAppSelector((state) => state.order);
    const { storeOptionList } = useAppSelector((state) => state.store);

    const [searchStoreIdx, onChangeSearchStoreIdx, setSearchStoreIdx] = useInputValue<undefined | number>(undefined);
    const [searchUserName, onChangeSearchUserName, setSearchUserName] = useInput('');

    const [searchPhone, onChangeSearchPhone, setSearchPhone] = useInput('');
    const [searchPackageYn, onChangeSearchPackageYn, setPackageYn] = useInputValue<undefined | 'Y' | 'N'>(undefined);
    const [searchStatus, onChangeSearchStatus, setStatus] = useInputValue<undefined | 'string'>(undefined);

    const [payStartDate, setPayStartDate] = useState<string>('');
    const [payEndDate, setPayEndDate] = useState<string>('');

    const [cancelStartDate, setCancelStartDate] = useState<string>('');
    const [cancelEndDate, setCancelEndDate] = useState<string>('');

    const [updateStartDate, setUpdateStartDate] = useState<string>('');
    const [updateEndDate, setUpdateEndDate] = useState<string>('');

    const [searchParam, setSearchParam] = useState<OrderListRequest>({ page: 1, limit: 10 });
    const [selectedRow, setSelectedRow] = useState<React.Key[]>([]);

    const [modalData, setModalData] = useState<OrderDataType | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const [cancelId, setCancelId] = useState<string | null>(null);
    const [cancelOpen, setCancelOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(orderSlice.actions.resetState());
        dispatch(getStoreList({}));
    }, []);

    useEffect(() => {
        dispatch(getOrderList(searchParam));
    }, [searchParam]);

    const toTimestamp = (date: string, time: string | null) => {
        if (date === '') {
            return '';
        }
        let timestamp = '';

        const startTimeArray = time?.split(':').map((item) => Number(item));
        if (startTimeArray) {
            timestamp = moment(date)
                .add(startTimeArray[0], 'hour')
                .add(startTimeArray[1], 'minute')
                .add(startTimeArray[2], 's')
                ?.format('x');
        } else {
            timestamp = moment(date).format('x');
        }

        return timestamp;
    };

    const onSearch = useCallback(() => {
        if ((payStartDate && !payEndDate) || (!payStartDate && payEndDate)) {
            notification['warning']({ message: '결제 기간 검색 날짜를 확인해 주세요.' });
            return;
        }
        if ((!cancelStartDate && cancelEndDate) || (cancelStartDate && !cancelEndDate)) {
            notification['warning']({ message: '결제 취소 기간 검색 날짜를 확인해 주세요.' });
            return;
        }
        if ((!updateStartDate && updateEndDate) || (updateStartDate && !updateEndDate)) {
            notification['warning']({ message: '최종 변경 기간 검색 날짜를 확인해 주세요.' });
            return;
        }
        let param: OrderListRequest = { page: 1, limit: 10 };
        if (searchUserName.trim() !== '') {
            param['user-name'] = searchUserName;
        }
        if (searchStoreIdx !== undefined) {
            param['store-idx'] = searchStoreIdx;
        }
        if (searchPhone.trim() !== '') {
            param['user-phone'] = searchPhone;
        }
        if (searchPackageYn) {
            param['package-goods-yn'] = searchPackageYn;
        }
        if (searchStatus) {
            param['order-status'] = searchStatus;
        }
        let payStart = toTimestamp(payStartDate, '00:00:00');
        let payEnd = toTimestamp(payEndDate, '23:59:59');
        if (payStart !== '') {
            param['pay-start-at'] = Number(payStart);
        }
        if (payEnd !== '') {
            param['pay-end-at'] = Number(payEnd);
        }
        let cancelStart = toTimestamp(cancelStartDate, '00:00:00');
        let cancelEnd = toTimestamp(cancelEndDate, '23:59:59');
        if (cancelStart !== '') {
            param['pay-cancel-start-at'] = Number(cancelStart);
        }
        if (cancelEnd !== '') {
            param['pay-cancel-end-at'] = Number(cancelEnd);
        }
        let updateStart = toTimestamp(updateStartDate, '00:00:00');
        let updateEnd = toTimestamp(updateEndDate, '23:59:59');
        if (updateStart !== '') {
            param['update-start-at'] = Number(updateStart);
        }
        if (updateEnd !== '') {
            param['update-end-at'] = Number(updateEnd);
        }
        setSearchParam(param);
    }, [
        searchUserName,
        searchPhone,
        searchPackageYn,
        searchStatus,
        searchStoreIdx,
        payStartDate,
        payEndDate,
        cancelStartDate,
        cancelEndDate,
        searchParam,
        updateStartDate,
        updateEndDate,
    ]);
    const onReset = useCallback(() => {
        setSearchStoreIdx(undefined);
        setSearchUserName('');
        setSearchPhone('');
        setPackageYn(undefined);
        setStatus(undefined);
        setPayStartDate('');
        setPayEndDate('');
        setCancelStartDate('');
        setCancelEndDate('');
        setUpdateStartDate('');
        setUpdateEndDate('');
        setSearchParam({ page: 1, limit: 10 });
    }, [
        searchUserName,
        searchPhone,
        searchPackageYn,
        searchStatus,
        searchStoreIdx,
        payStartDate,
        payEndDate,
        cancelStartDate,
        cancelEndDate,
        searchParam,
        updateStartDate,
        updateEndDate,
    ]);
    const onDownload = useCallback(() => {
        let param: OrderCsvRequest = {};
        if (searchUserName.trim() !== '') {
            param['user-name'] = searchUserName;
        }
        if (searchStoreIdx !== undefined) {
            param['store-idx'] = searchStoreIdx;
        }
        if (searchPhone.trim() !== '') {
            param['user-phone'] = searchPhone;
        }
        if (searchPackageYn) {
            param['package-goods-yn'] = searchPackageYn;
        }
        if (searchStatus) {
            param['order-status'] = searchStatus;
        }
        let payStart = toTimestamp(payStartDate, '00:00:00');
        let payEnd = toTimestamp(payEndDate, '23:59:59');
        if (payStart !== '') {
            param['pay-start-at'] = Number(payStart);
        }
        if (payEnd !== '') {
            param['pay-end-at'] = Number(payEnd);
        }
        let cancelStart = toTimestamp(cancelStartDate, '00:00:00');
        let cancelEnd = toTimestamp(cancelEndDate, '23:59:59');
        if (cancelStart !== '') {
            param['pay-cancel-start-at'] = Number(cancelStart);
        }
        if (cancelEnd !== '') {
            param['pay-cancel-end-at'] = Number(cancelEnd);
        }
        let updateStart = toTimestamp(updateStartDate, '00:00:00');
        let updateEnd = toTimestamp(updateEndDate, '23:59:59');
        if (updateStart !== '') {
            param['update-start-at'] = Number(updateStart);
        }
        if (updateEnd !== '') {
            param['update-end-at'] = Number(updateEnd);
        }
        dispatch(getOrderCSV(param));
    }, [
        searchUserName,
        searchPhone,
        searchPackageYn,
        searchStatus,
        searchStoreIdx,
        payStartDate,
        payEndDate,
        cancelStartDate,
        cancelEndDate,
        searchParam,
        updateStartDate,
        updateEndDate,
    ]);

    const onSelectRow = useCallback(
        (key: React.Key[], row: OrderDataType[]) => {
            setSelectedRow(key);
        },
        [selectedRow],
    );

    const onChangePage: TableProps<OrderDataType>['onChange'] = useCallback(
        (pagination: TablePaginationConfig, filter: any, sorter: any) => {
            console.log('onChangePage', sorter.order);
            let param: OrderListRequest = { ...searchParam, page: pagination.current };
            if (sorter.order) {
                if (sorter.order === 'ascend') {
                    param['update-sort-status'] = '1';
                } else if (sorter.order === 'descend') {
                    param['update-sort-status'] = '2';
                }
            }
            setSearchParam(param);
            setSelectedRow([]);
        },
        [searchParam, selectedRow],
    );

    const onDelete = useCallback(() => {
        if (selectedRow.length < 1) {
            notification['warning']({
                message: '예약 및 결제를 취소할 항목을 선택해 주세요.',
            });
            return;
        }
        setCancelId(selectedRow.length > 0 ? selectedRow[0].toString() : null);
        setCancelOpen(true);
    }, [selectedRow]);

    useEffect(() => {
        if (downloadSuccess && downloadLink !== '') {
            const a = document.createElement('a');
            a.href = downloadLink;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadLink);
            dispatch(orderSlice.actions.resetDownload());
        }
    }, [downloadLink, downloadSuccess]);

    useEffect(() => {
        if (listFailure) {
            notification['warning']({
                message: '목록 조회에 실패했습니다.',
            });
        }
        if (downloadFailure) {
            notification['warning']({
                message: '파일 다운로드에 실패했습니다.',
            });
        }
        if (deleteSuccess) {
            notification['success']({
                message: '예약이 취소되었습니다.',
            });
            dispatch(getOrderList(searchParam));
        }
        dispatch(orderSlice.actions.changeInitState());
    }, [listFailure, downloadSuccess, downloadFailure, searchParam]);

    return (
        <AppLayout>
            <Title title={`Order`} subTitle={`예약 및 결제 관리`} />
            <Row gutter={[16, 16]} justify={'space-between'} align={'bottom'} style={{ marginBottom: '0.5rem' }}>
                <Col span={20}>
                    <Row gutter={[16, 16]} align={'bottom'}>
                        <Col span={4}>
                            <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                스토어
                            </Typography.Text>
                            <Select
                                value={searchStoreIdx}
                                onChange={onChangeSearchStoreIdx}
                                placeholder={'스토어 선택'}
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
                        <Col span={4}>
                            <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                주문상태
                            </Typography.Text>
                            <Select
                                value={searchStatus}
                                onChange={onChangeSearchStatus}
                                placeholder={'주문상태 선택'}
                                size={'large'}
                                style={{ width: '100%' }}
                                allowClear>
                                <Select.Option value="0">결제요청</Select.Option>
                                <Select.Option value="1">결제성공</Select.Option>
                                <Select.Option value="2">결제실패</Select.Option>
                                <Select.Option value="3">취소성공</Select.Option>
                                <Select.Option value="4">취소실패</Select.Option>
                            </Select>
                        </Col>

                        <Col span={4}>
                            <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                예약자명
                            </Typography.Text>
                            <Input
                                value={searchUserName}
                                onChange={onChangeSearchUserName}
                                placeholder={'예약자명'}
                                size={'large'}
                                allowClear
                            />
                        </Col>
                        <Col span={4}>
                            <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                전화번호
                            </Typography.Text>
                            <Input
                                value={searchPhone}
                                onChange={onChangeSearchPhone}
                                placeholder={'-를 빼고 입력해 주세요.'}
                                size={'large'}
                                allowClear
                            />
                        </Col>
                        <Col span={4}>
                            <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                상품타입
                            </Typography.Text>
                            <Select
                                value={searchPackageYn}
                                onChange={onChangeSearchPackageYn}
                                placeholder={'상품타입 선택'}
                                size={'large'}
                                style={{ width: '100%' }}
                                allowClear>
                                <Select.Option value="Y">패키지상품</Select.Option>
                                <Select.Option value="N">일반상품</Select.Option>
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Typography.Text type="secondary" style={{ display: 'block', fontSize: '0.8rem' }}>
                                결제일 검색 범위
                            </Typography.Text>
                            <DatePicker
                                size={'large'}
                                placeholder={`결제 시작 날짜`}
                                value={payStartDate ? moment(payStartDate, 'YYYY-MM-DD') : null}
                                onChange={(value: any, string: string) => setPayStartDate(string)}
                                allowClear
                            />
                            <Typography.Text type="secondary">&nbsp;&nbsp;~&nbsp;&nbsp;</Typography.Text>
                            <DatePicker
                                size={'large'}
                                placeholder={`결제 종료 날짜`}
                                value={payEndDate ? moment(payEndDate, 'YYYY-MM-DD') : null}
                                onChange={(value: any, string: string) => setPayEndDate(string)}
                                allowClear
                            />
                        </Col>
                        <Col span={8}>
                            <Typography.Text type="secondary" style={{ display: 'block', fontSize: '0.8rem' }}>
                                취소일 검색 범위
                            </Typography.Text>
                            <DatePicker
                                size={'large'}
                                placeholder={`취소 시작 날짜`}
                                value={cancelStartDate ? moment(cancelStartDate, 'YYYY-MM-DD') : null}
                                onChange={(value: any, string: string) => setCancelStartDate(string)}
                                allowClear
                            />
                            <Typography.Text type="secondary">&nbsp;&nbsp;~&nbsp;&nbsp;</Typography.Text>
                            <DatePicker
                                size={'large'}
                                placeholder={`취소 종료 날짜`}
                                value={cancelEndDate ? moment(cancelEndDate, 'YYYY-MM-DD') : null}
                                onChange={(value: any, string: string) => setCancelEndDate(string)}
                                allowClear
                            />
                        </Col>
                        <Col span={8}>
                            <Typography.Text type="secondary" style={{ display: 'block', fontSize: '0.8rem' }}>
                                최종변경일 검색 범위
                            </Typography.Text>
                            <DatePicker
                                size={'large'}
                                placeholder={`최종변경일 시작 날짜`}
                                value={updateStartDate ? moment(updateStartDate, 'YYYY-MM-DD') : null}
                                onChange={(value: any, string: string) => setUpdateStartDate(string)}
                                allowClear
                            />
                            <Typography.Text type="secondary">&nbsp;&nbsp;~&nbsp;&nbsp;</Typography.Text>
                            <DatePicker
                                size={'large'}
                                placeholder={`최종변경일 종료 날짜`}
                                value={updateEndDate ? moment(updateEndDate, 'YYYY-MM-DD') : null}
                                onChange={(value: any, string: string) => setUpdateEndDate(string)}
                                allowClear
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                    <Row gutter={[16, 16]} justify={'end'} style={{ marginBottom: '0.5rem' }}>
                        <Button size={'large'} onClick={onReset}>
                            초기화
                        </Button>
                        <Button
                            size={'large'}
                            style={{ marginLeft: '0.5rem' }}
                            loading={downloadLoading}
                            onClick={onDownload}>
                            <FileExcelOutlined /> 다운로드
                        </Button>
                        <Button type={'primary'} size={'large'} style={{ marginLeft: '0.5rem' }} onClick={onSearch}>
                            검색
                        </Button>
                    </Row>
                    <Row gutter={[16, 16]} justify={'end'}>
                        <Button size="large" danger onClick={onDelete}>
                            예약 취소
                        </Button>
                    </Row>
                </Col>
            </Row>
            <Table
                scroll={{ x: true }}
                rowKey={(item: OrderDataType) => item.orderId}
                dataSource={tableData}
                rowSelection={{
                    type: 'radio',
                    getCheckboxProps: (record: OrderDataType) => ({ disabled: record.orderStatus !== '1' }),
                    selectedRowKeys: selectedRow,
                    onChange: onSelectRow,
                }}
                expandable={{
                    expandIconColumnIndex: 4,
                    rowExpandable: (record) => record.bookingInfoList.length > 0,
                    expandIcon: ({ expanded, onExpand, record }) =>
                        expanded ? (
                            <UpOutlined style={{ color: '#bfbfbf' }} onClick={(e) => onExpand(record, e)} />
                        ) : (
                            <DownOutlined onClick={(e) => onExpand(record, e)} />
                        ),
                    expandedRowRender: (record) => (
                        <Row>
                            <Col span={23} offset={1}>
                                <BookingExpandTable data={record.bookingInfoList} />
                            </Col>
                        </Row>
                    ),
                }}
                pagination={{
                    current: searchParam.page,
                    pageSize: searchParam.limit,
                    total: total,
                }}
                onChange={onChangePage}
                loading={listLoading}
                footer={() => `total ${total}`}>
                {column?.map((col) => {
                    if (col.key === 'orderId') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                width={col.width}
                                render={(_: any, record) => (
                                    <Button
                                        type={`link`}
                                        onClick={() => {
                                            setModalData(record);
                                            setModalOpen(true);
                                        }}>
                                        {_}
                                    </Button>
                                )}
                            />
                        );
                    }
                    if (col.key === 'orderType') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                width={col.width}
                                render={(_: any, record) => (
                                    <>
                                        {_ === '0' ? (
                                            <Tag color={'blue'}>일반</Tag>
                                        ) : _ === '1' ? (
                                            <>
                                                <Tag color={'magenta'}>패키지</Tag>
                                                <Tag color={'magenta'}>{record.packageName}</Tag>
                                            </>
                                        ) : (
                                            '-'
                                        )}
                                    </>
                                )}
                            />
                        );
                    }
                    if (col.key === 'bookingInfoList') {
                        return (
                            <Table.Column
                                align={'center'}
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                width={col.width}
                                render={(_: BookingInfoItem[], record) => {
                                    return <Tag>{_.length}개</Tag>;
                                }}
                            />
                        );
                    }
                    if (col.key === 'orderStatus') {
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
                                            ? `결제요청`
                                            : _ === '1'
                                            ? `결제성공`
                                            : _ === '2'
                                            ? `결제실패`
                                            : _ === '3'
                                            ? `취소성공`
                                            : _ === '4'
                                            ? '취소실패'
                                            : '-'}
                                    </Typography.Text>
                                )}
                            />
                        );
                    }
                    if (col.key === 'orderUpdateDate') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                width={col.width}
                                sorter
                                render={(_: any, record) => <>{_}</>}
                            />
                        );
                    }
                    return <Table.Column title={col.title} dataIndex={col.key} width={col.width} key={col.key} />;
                })}
            </Table>
            <DetailModal
                data={modalData}
                open={modalOpen}
                setOpen={setModalOpen}
                setCancelId={setCancelId}
                setCancelOpen={setCancelOpen}
            />
            <CancelModal id={cancelId} open={cancelOpen} setDetailOpen={setModalOpen} setCancelOpen={setCancelOpen} />
        </AppLayout>
    );
};

export default Order;
