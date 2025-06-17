import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, DatePicker, Input, notification, Row, Table, TimePicker, Typography } from 'antd';
import moment from 'moment-timezone';
import { TablePaginationConfig } from 'antd/es/table/interface';
import { useAppDispatch, useAppSelector } from '../../../../hooks/useToolkit';
import storeReservationSlice from '../../../../store/slice/store/reservation';
import { getBookingCSV, getBookingList } from '../../../../api/contents/booking/booking';
import bookingSlice, { BookingDataType } from '../../../../store/slice/booking/booking';

const ReservationTable = ({ id, lang }: { id: string; lang: string }) => {
    const dispatch = useAppDispatch();

    const { column, tableData, downloadLink, loadingSuccess, loadingFailure, downloadSuccess, downloadFailure } =
        useAppSelector((state) => state.booking);

    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [page, setPage] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    useEffect(() => {
        if (lang !== '') {
            moment.tz.setDefault(lang);
        }
    }, [lang]);

    useEffect(() => {
        // id로 테이블 데이터 불러오기
        dispatch(storeReservationSlice.actions.resetState());
        dispatch(storeReservationSlice.actions.setTableData());

        dispatch(getBookingList({ 'store-idx': Number(id), page: page.current, limit: page.pageSize }));
    }, [id]);

    const onChangePage = useCallback(
        (pagination: TablePaginationConfig) => {
            console.log('onChange', pagination);
            setPage(pagination);
        },
        [page],
    );
    const onChangeStartDate = useCallback(
        (value: any, string: string) => {
            setStartDate(string);
        },
        [startDate],
    );
    const onChangeEndDate = useCallback(
        (value: any, string: string) => {
            setEndDate(string);
            // setStartDate(moment(value).tz(lang)?.format('x'));
        },
        [endDate],
    );
    const onChangeStartTime = useCallback(
        (value: any, string: string) => {
            setStartTime(string);
            // setStartDate(moment(value).tz(lang)?.format('x'));
        },
        [startTime],
    );
    const onChangeEndTime = useCallback(
        (value: any, string: string) => {
            setEndTime(string);
            // setStartDate(moment(value).tz(lang)?.format('x'));
        },
        [endTime],
    );

    const toTimestamp = (date: string | null, time: string | null) => {
        let timestamp = '';

        const startTimeArray = time?.split(':').map((item) => Number(item));
        if (startTimeArray) {
            timestamp = moment(date)
                .add(startTimeArray[0], 'hour')
                .add(startTimeArray[1], 'minute')
                .add(startTimeArray[2], 's')
                .tz(lang)
                ?.format('x');
        } else {
            if (date) {
                timestamp = moment(date).format('x');
            } else {
                timestamp = '';
            }
        }

        return timestamp;
    };
    const onDownload = useCallback(() => {
        const start = toTimestamp(startDate, startTime);
        const end = toTimestamp(endDate, endTime);
        console.log('다운로드..........', start, end);
        if (start !== '' && end !== '') {
            dispatch(
                getBookingCSV({
                    'store-idx': Number(id),
                    'start-at': Number(start),
                    'end-at': Number(end),
                }),
            );
        } else if (start !== '' && end === '') {
            dispatch(
                getBookingCSV({
                    'store-idx': Number(id),
                    'start-at': Number(start),
                }),
            );
        } else if (start === '' && end !== '') {
            dispatch(
                getBookingCSV({
                    'store-idx': Number(id),
                    'end-at': Number(end),
                }),
            );
        } else {
            dispatch(
                getBookingCSV({
                    'store-idx': Number(id),
                }),
            );
        }
    }, [startDate, endDate, startTime, endTime]);
    const onSearch = useCallback(() => {
        const start = toTimestamp(startDate, startTime);
        const end = toTimestamp(endDate, endTime);

        if (start === '' && end === '') {
            dispatch(
                getBookingList({
                    page: page.current,
                    limit: page.pageSize,
                    'store-idx': Number(id),
                }),
            );
        } else if (start !== '' && end !== '') {
            dispatch(
                getBookingList({
                    page: page.current,
                    limit: page.pageSize,
                    'store-idx': Number(id),
                    'pay-start-at': Number(start),
                    'pay-end-at': Number(end),
                }),
            );
        } else if (start !== '' && end === '') {
            dispatch(
                getBookingList({
                    page: page.current,
                    limit: page.pageSize,
                    'store-idx': Number(id),
                    'pay-start-at': Number(start),
                }),
            );
        } else if (start === '' && end !== '') {
            dispatch(
                getBookingList({
                    page: page.current,
                    limit: page.pageSize,
                    'store-idx': Number(id),
                }),
            );
        }
    }, [id, startDate, endDate, startTime, endTime]);

    useEffect(() => {
        if (loadingFailure) {
            notification['warning']({
                message: '예약자 목록 조회에 실패했습니다.',
            });
        }
    }, [loadingFailure]);
    useEffect(() => {
        if (downloadSuccess && downloadLink !== '') {
            const a = document.createElement('a');
            a.href = downloadLink;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadLink);
            dispatch(bookingSlice.actions.resetDownload());
        }
    }, [downloadLink, downloadSuccess]);
    useEffect(() => {
        if (downloadFailure) {
            notification['warning']({
                message: '파일 다운로드에 실패했습니다.',
            });
        }
    }, [downloadFailure]);

    return (
        <Row justify={'space-between'} gutter={[16, 16]} style={{ marginBottom: '2rem' }}>
            <Col span={4}>
                <Typography.Text type="secondary">스토어 예약 목록</Typography.Text>
            </Col>
            <Col></Col>
            <Col>
                <DatePicker
                    placeholder={`검색 시작 날짜`}
                    value={startDate ? moment(startDate, 'YYYY-MM-DD') : null}
                    onChange={onChangeStartDate}
                />
                <TimePicker
                    placeholder={`검색 시작 시간`}
                    value={startTime ? moment(startTime, 'HH-mm-ss') : null}
                    format={'HH:mm:ss'}
                    onChange={onChangeStartTime}
                />
                <Typography.Text type="secondary">&nbsp;&nbsp;~&nbsp;&nbsp;</Typography.Text>
                <DatePicker
                    placeholder={`검색 종료 날짜`}
                    value={endDate ? moment(endDate, 'YYYY-MM-DD') : null}
                    onChange={onChangeEndDate}
                />
                <TimePicker
                    placeholder={`검색 종료 시간`}
                    value={endTime ? moment(endTime, 'HH:mm:ss') : null}
                    format={'HH:mm:ss'}
                    onChange={onChangeEndTime}
                />
                <Button type={'primary'} style={{ marginLeft: '0.5rem' }} onClick={onSearch}>
                    검색
                </Button>
                <Button style={{ marginLeft: '0.5rem' }} onClick={onDownload}>
                    데이터 다운로드
                </Button>
            </Col>
            <Col span={24}>
                <Table dataSource={tableData} pagination={page} onChange={onChangePage}>
                    {column.map((col) => {
                        if (col.key === 'bookingTime') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    render={(_: any, record: BookingDataType) => {
                                        if (lang !== '') {
                                            return <span>{moment(_).tz(lang)?.format('YYYY-MM-DD HH:mm:ss')}</span>;
                                        } else {
                                            <span>{moment(_).format('YYYY-MM-DD HH:mm:ss')}</span>;
                                        }
                                    }}
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
                                                    : undefined
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
            </Col>
        </Row>
    );
};

export default ReservationTable;
