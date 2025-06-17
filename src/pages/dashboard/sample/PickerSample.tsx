import React, { useState, useCallback } from 'react';
import { Col, Row, Select, TimePicker, DatePicker, Typography } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';

const PickerSample = () => {
    const [time, setTime] = useState<any | null>('00:00:00');
    const [date, setDate] = useState<Moment | null>(null);
    //moment(endTime).format('HH:mm:ss')
    // timestamp with second: .format('X'), with ms: .format('x')
    const onChangeTime = useCallback(
        (value: Moment | null, string: string | null) => {
            const utc = moment(string);
            const locale = moment(utc).locale();
            console.log('sdsdsdsdsdsd', value, moment(value).format('HH:mm:ss'), moment(string, 'HH:mm:ss'));
            setTime(value);
        },
        [time],
    );
    const onChangeDate = useCallback(
        (value: Moment | null) => {
            setDate(value);
        },
        [date],
    );
    return (
        <>
            <Typography.Title level={5}>data, time picker</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col md={8}>
                    <TimePicker value={moment(time, 'HH:mm:ss')} format={'HH:mm:ss'} onChange={onChangeTime} />
                </Col>
                <Col md={8}>
                    <DatePicker value={date} onChange={onChangeDate} />
                </Col>
            </Row>
        </>
    );
};

export default PickerSample;
