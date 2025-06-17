import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../../components/layouts/AppLayout';
import Title from '../../../components/container/Title';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import { Button, Col, Input, notification, Radio, Row, Typography } from 'antd';
import useInput from '../../../hooks/useInput';
import UploadButton from '../../../components/UploadButton';
import { saveEvent, uploadEventImage } from '../../../api/contents/event/event';
import eventSlice, { EventDataType } from '../../../store/slice/event/event';
import { AddEventRequest, EditEventRequest } from '../../../api/contents/event/eventType';

const EventDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { saveLoading, saveFailure, saveSuccess, uploadResponse } = useAppSelector((state) => state.event);

    const [eventIdx, setEventIdx] = useState<number | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [buttonText, onChangeButtonText, setButtonText] = useInput('');
    const [buttonUrl, onChangeButtonUrl, setButtonUrl] = useInput('');
    const [useYn, onChangeUseYn, setUseYn] = useInput('N');

    useEffect(() => {
        dispatch(eventSlice.actions.changeInitState());
    }, []);
    useEffect(() => {
        const data: EventDataType = location.state as EventDataType;
        if (data) {
            setEventIdx(data.eventIdx);
            setImageUrl(data.imageUrl);
            setButtonText(data.buttonText);
            setButtonUrl(data.buttonUrl);
            setUseYn(data.useYn);
        }
    }, [location]);

    useEffect(() => {
        if (uploadResponse) {
            setImageUrl(uploadResponse);
        }
    }, [uploadResponse]);

    const onSave = useCallback(() => {
        if (imageUrl === '') {
            notification['warning']({ message: '이벤트 팝업 이미지를 선택해 주세요.' });
            return;
        }
        if (buttonText.trim() === '') {
            notification['warning']({ message: '버튼 텍스트를 입력해 주세요.' });
            return;
        }
        if (buttonUrl.trim() === '') {
            notification['warning']({ message: '버튼 링크를 입력해 주세요.' });
            return;
        }
        const urlRegex = /^http[s]?\:\/\//i;
        if (!urlRegex.test(buttonUrl)) {
            notification['warning']({
                message: (
                    <>
                        링크 형식이 잘못되었습니다.
                        <br />
                        'http://' 또는 'https://'로 시작되게 입력해 주세요.
                    </>
                ),
            });
            return;
        }

        if (eventIdx) {
            const data: EditEventRequest = {
                event_idx: eventIdx,
                button_name: buttonText,
                button_url: buttonUrl,
                image_file_url: imageUrl,
                use_yn: useYn,
            };
            dispatch(saveEvent(data));
        } else {
            const data: AddEventRequest = {
                image_file_url: imageUrl,
                button_name: buttonText,
                button_url: buttonUrl,
                use_yn: useYn,
            };
            dispatch(saveEvent(data));
        }
    }, [eventIdx, imageUrl, buttonText, buttonUrl, useYn]);

    useEffect(() => {
        if (saveFailure) {
            notification['warning']({ message: '저장에 실패했습니다.' });
            dispatch(eventSlice.actions.changeInitState());
        }
        if (saveSuccess) {
            notification['success']({ message: '저장되었습니다.' });
            dispatch(eventSlice.actions.changeInitState());
            if (eventIdx === null) {
                navigate('/event');
            }
        }
    }, [eventIdx, saveFailure, saveSuccess]);

    return (
        <AppLayout>
            <Title title={`Event`} subTitle={`이벤트 팝업 ${location.state ? 'Edit' : 'Create'}`} />
            <Row gutter={[16, 16]}>
                <Col span={4}>
                    <Typography.Text type="secondary">이벤트 팝업 이미지</Typography.Text>
                </Col>
                <Col span={6}>
                    <UploadButton
                        getImage={(image: any) => {
                            const formData = new FormData();
                            formData.append('img', image);
                            dispatch(uploadEventImage(formData));
                        }}
                    />
                    <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                        이미지 사이즈 540x750 (px)
                    </Typography.Text>
                </Col>
                <Col span={14}>
                    {imageUrl !== '' && (
                        <img
                            src={imageUrl}
                            alt={'이벤트 팝업 이미지'}
                            style={{
                                display: 'block',
                                maxWidth: '100%',
                                height: 'auto',
                                maxHeight: '300px',
                            }}
                        />
                    )}
                </Col>
                <Col span={4}>
                    <Typography.Text type="secondary">버튼 텍스트</Typography.Text>
                </Col>
                <Col span={8}>
                    <Input value={buttonText} onChange={onChangeButtonText} />
                </Col>
                <Col span={12} />
                <Col span={4}>
                    <Typography.Text type="secondary">버튼 링크</Typography.Text>
                </Col>
                <Col span={16}>
                    <Input value={buttonUrl} onChange={onChangeButtonUrl} />
                </Col>
                <Col span={4} />
                <Col span={4}>
                    <Typography.Text type="secondary">서비스 여부</Typography.Text>
                </Col>
                <Col span={20}>
                    <Radio.Group onChange={onChangeUseYn} value={useYn}>
                        <Radio.Button value={'Y'}>사용</Radio.Button>
                        <Radio.Button value={'N'}>미사용</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
            <Row justify={'end'} style={{ padding: '3rem 0' }}>
                <Button size={'large'} onClick={() => navigate('/event')}>
                    Back
                </Button>
                <Button
                    loading={saveLoading}
                    size={'large'}
                    type={'primary'}
                    style={{ marginLeft: '0.5rem' }}
                    onClick={onSave}>
                    Save
                </Button>
            </Row>
        </AppLayout>
    );
};
export default EventDetail;
