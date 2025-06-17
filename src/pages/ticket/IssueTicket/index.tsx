import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, DatePicker, Modal, notification, Row, TimePicker, Typography } from 'antd';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import { issueTicket } from '../../../api/contents/ticket/ticket';
import ticketSlice from '../../../store/slice/ticket/ticket';

const IssueTicket = () => {
    const dispatch = useAppDispatch();
    const { saveLoading, saveSuccess, saveFailure } = useAppSelector((state) => state.ticket);

    const [startDate, setStartDate] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);

    const toTimestamp = (date: string | null, time: string | null) => {
        let timestamp = '';

        const startTimeArray = time?.split(':').map((item) => Number(item));
        if (startTimeArray) {
            timestamp = moment(date)
                .add(startTimeArray[0], 'hour')
                .add(startTimeArray[1], 'minute')
                .add(startTimeArray[2], 's')
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

    const onIssueTicket = useCallback(() => {
        let bookingDateFrom = toTimestamp(startDate, startTime);
        let bookingDateTo = toTimestamp(endDate, endTime);

        if (bookingDateFrom === '' || bookingDateTo === '') {
            notification['warning']({ message: '티켓 사용 기간을 입력해 주세요.' });
            return;
        }

        dispatch(issueTicket({ booking_date_from: Number(bookingDateFrom), booking_date_to: Number(bookingDateTo) }));
    }, [startDate, startTime, endDate, endTime]);

    useEffect(() => {
        if (saveFailure) {
            notification['warning']({
                message: 'QR 생성에 실패했습니다.',
            });
        }
        dispatch(ticketSlice.actions.changeInitState());
    }, [saveFailure]);

    return (
        <>
            <Typography.Title level={5}>무료티켓 추가</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <DatePicker
                        size={'large'}
                        placeholder={`탑승 시작 날짜`}
                        value={startDate ? moment(startDate, 'YYYY-MM-DD') : null}
                        onChange={(value: any, string: string) => setStartDate(string)}
                        allowClear
                    />
                    <TimePicker
                        size={'large'}
                        placeholder={`탑승 시작 시간`}
                        value={startTime ? moment(startTime, 'HH-mm-ss') : null}
                        format={'HH:mm:ss'}
                        onChange={(value: any, string: string) => setStartTime(string)}
                        allowClear
                    />
                    <Typography.Text type="secondary">&nbsp;&nbsp;~&nbsp;&nbsp;</Typography.Text>
                    <DatePicker
                        size={'large'}
                        placeholder={`탑승 시작 날짜`}
                        value={endDate ? moment(endDate, 'YYYY-MM-DD') : null}
                        onChange={(value: any, string: string) => setEndDate(string)}
                        allowClear
                    />
                    <TimePicker
                        size={'large'}
                        placeholder={`탑승 시작 시간`}
                        value={endTime ? moment(endTime, 'HH-mm-ss') : null}
                        format={'HH:mm:ss'}
                        onChange={(value: any, string: string) => setEndTime(string)}
                        allowClear
                    />
                    <Button
                        size="large"
                        type={'primary'}
                        style={{ marginLeft: '0.5rem' }}
                        loading={saveLoading}
                        onClick={onIssueTicket}>
                        티켓 등록
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default IssueTicket;
