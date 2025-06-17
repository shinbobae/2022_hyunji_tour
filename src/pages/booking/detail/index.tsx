import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../../components/layouts/AppLayout';
import Title from '../../../components/container/Title';
import { Row, Col, Input, Typography, DatePicker, TimePicker, Button, notification, Select, Checkbox } from 'antd';
import useInput from '../../../hooks/useInput';
import useInputValue from '../../../hooks/useInputValue';
import moment from 'moment-timezone';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import { getStoreGoodsList, getStoreList } from '../../../api/contents/store/store';
import { Link } from 'react-router-dom';
import bookingSlice from '../../../store/slice/booking/booking';
import { useNavigate } from 'react-router';
import { AddBookingRequest } from '../../../api/contents/booking/bookingType';
import { addBooking } from '../../../api/contents/booking/booking';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const BookingDetail = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { storeOptionList } = useAppSelector((state) => state.store);
    const { storeGoodsList } = useAppSelector((state) => state.storeDetail);
    const { saveFailure, saveLoading, saveSuccess } = useAppSelector((state) => state.booking);

    const [name, onChangeName] = useInput('');
    const [email, onChangeEmail] = useInput('');
    const [phone, onChangePhone] = useInput('');
    const [storeIdx, onChangeStoreIdx] = useInputValue<undefined | number>(undefined);
    const [goodsIdx, onChangeGoodsIdx] = useInputValue<undefined | number>(undefined);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [sameDay, setSameDay] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getStoreList({}));
    }, []);

    useEffect(() => {
        if (storeIdx !== undefined) {
            dispatch(getStoreGoodsList({ storeIdx: storeIdx }));
        }
    }, [storeIdx]);

    const toTimestamp = (date: string, time?: string) => {
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

        return Number(timestamp);
    };

    useEffect(() => {
        if (sameDay) {
            setEndDate(startDate);
        }
    }, [sameDay, startDate]);

    const onSave = useCallback(() => {
        if (name.trim() === '') {
            notification['warning']({ message: '예약자명을 입력해 주세요.' });
            return;
        }
        if (email.trim() === '') {
            notification['warning']({ message: '예약자명을 입력해 주세요.' });
            return;
        }
        if (phone.trim() === '') {
            notification['warning']({ message: '예약자명을 입력해 주세요.' });
            return;
        }
        if (storeIdx === undefined) {
            notification['warning']({ message: '스토어를 선택해 주세요.' });
            return;
        }
        if (goodsIdx === undefined) {
            notification['warning']({ message: '상품을 선택해 주세요.' });
            return;
        }
        if (!startDate || !endDate) {
            notification['warning']({ message: '예약기간을 선택해 주세요.' });
            return;
        }

        const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!emailRegex.test(email)) {
            notification['warning']({ message: '이메일 형식을 확인해 주세요.' });
            return;
        }
        const phoneRegex = /\d{3}-\d{3,4}-\d{4}/;
        if (!phoneRegex.test(phone)) {
            notification['warning']({ message: '휴대폰 번호를 확인해 주세요.' });
            return;
        }

        const saveData: AddBookingRequest = {
            user_name: name,
            user_email: email,
            user_phone: phone,
            store_idx: storeIdx,
            goods_idx: goodsIdx,
            booking_date_from: toTimestamp(startDate),
            booking_date_to: toTimestamp(endDate),
        };

        dispatch(addBooking(saveData));
    }, [name, email, phone, storeIdx, goodsIdx, startDate, endDate]);

    useEffect(() => {
        if (saveFailure) {
            notification['warning']({ message: '저장에 실패했습니다.' });
            dispatch(bookingSlice.actions.changeInitState());
        }
        if (saveSuccess) {
            notification['success']({ message: '저장되었습니다.' });
            dispatch(bookingSlice.actions.changeInitState());
            navigate('/booking');
        }
    }, [saveFailure, saveSuccess]);
    return (
        <AppLayout>
            <Title title={`Booking`} />
            <Row gutter={[16, 16]} align={'bottom'}>
                <Col span={6}>
                    <Typography.Text type="secondary">예약자명</Typography.Text>
                    <Input value={name} onChange={onChangeName} />
                </Col>
                <Col span={6}>
                    <Typography.Text type="secondary">이메일</Typography.Text>
                    <Input value={email} onChange={onChangeEmail} />
                </Col>
                <Col span={6}>
                    <Typography.Text type="secondary">연락처</Typography.Text>
                    <Input placeholder={`000-0000-0000`} value={phone} onChange={onChangePhone} />
                </Col>
                <Col span={6} />
                <Col span={6}>
                    <Typography.Text type="secondary">스토어 및 상품선택</Typography.Text>
                    <Select
                        value={storeIdx}
                        onChange={onChangeStoreIdx}
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
                <Col span={6}>
                    <Select
                        value={goodsIdx}
                        onChange={onChangeGoodsIdx}
                        placeholder={'상품 선택'}
                        size={'large'}
                        style={{ width: '100%' }}
                        allowClear>
                        {storeGoodsList.map((item) => (
                            <Select.Option key={item.goods_idx} value={item.goods_idx}>
                                {item.goods_name}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col span={12} />
                <Col span={24}>
                    <Typography.Text type="secondary">예약 기간</Typography.Text>
                    <Row align={'middle'} gutter={[8, 8]}>
                        <Col>
                            <DatePicker
                                size={'large'}
                                placeholder={`예약 시작 날짜`}
                                value={startDate ? moment(startDate, 'YYYY-MM-DD') : null}
                                onChange={(value: any, string: string) => setStartDate(string)}
                            />
                        </Col>
                        <Col>
                            <Typography.Text type="secondary">~</Typography.Text>
                        </Col>
                        <Col>
                            <DatePicker
                                size={'large'}
                                placeholder={`예약 종료 날짜`}
                                value={endDate ? moment(endDate, 'YYYY-MM-DD') : null}
                                onChange={(value: any, string: string) => setEndDate(string)}
                            />
                        </Col>
                        <Col>
                            <Checkbox
                                value={sameDay}
                                onChange={(e: CheckboxChangeEvent) => setSameDay(e.target.checked)}>
                                시작일 기준으로 1일
                            </Checkbox>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={[16, 16]} justify={'end'} style={{ marginTop: '2rem' }}>
                <Link to={'/booking'} style={{ marginRight: '0.5rem' }}>
                    <Button size={'large'}>취소</Button>
                </Link>
                <Button size={'large'} type={'primary'} onClick={onSave} loading={saveLoading}>
                    저장
                </Button>
            </Row>
        </AppLayout>
    );
};

export default BookingDetail;
