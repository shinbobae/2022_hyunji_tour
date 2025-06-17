import React, { useEffect, useState, SetStateAction, Dispatch, useCallback } from 'react';
import { Button, Col, Input, Modal, notification, Radio, Row, Select, Typography } from 'antd';
import busSlice, { BusDataType } from '../../../store/slice/bus/bus';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import useInput from '../../../hooks/useInput';
import { getRouteList } from '../../../api/contents/busRoute/busRoute';
import useInputValue from '../../../hooks/useInputValue';
import { BusRouteListType } from '../../../api/contents/busRoute/busRouteType';
import { saveBus } from '../../../api/contents/bus/bus';
import { BusSaveRequest } from '../../../api/contents/bus/busType';
import { getManagerList } from '../../../api/contents/manage/manage';
import { ObjectOption } from '../../../api/type';

interface Props {
    currentBus?: BusDataType | null;
}
const BusDetailModal = ({ currentBus }: Props) => {
    const dispatch = useAppDispatch();
    const { modalMode, saveSuccess, saveFailure } = useAppSelector((state) => state.bus);
    const { routeRespData } = useAppSelector((state) => state.route);
    const { adminOptionList } = useAppSelector((state) => state.adminSetting);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idx, setIdx] = useState<number | null>(null);
    const [busName, onChangeBusName, setBusName] = useInput('');
    const [busRoute, onChangeBusRoute, setBusRoute] = useInputValue<number | null>(null);
    const [busManager, onChangeBusManager, setBusManager] = useInputValue<number | null>(null);
    const [busYn, onChangeBusYn, setBusYn] = useInput('N');

    useEffect(() => {
        dispatch(getRouteList({}));
        dispatch(getManagerList({ 'manager-role-idx': 3 }));
    }, []);

    useEffect(() => {
        console.log('currentBus', currentBus);
        if (currentBus && modalMode === 'detail') {
            setOpen(true);
            setIdx(currentBus.busId);
            setBusName(currentBus.busName);
            setBusRoute(currentBus.busRoute);
            setBusManager(currentBus.busManagerIdx);
            setBusYn(currentBus.busStatus);
        } else {
            initState();
        }
    }, [modalMode, currentBus]);

    const onClose = useCallback(() => {
        dispatch(busSlice.actions.changeModalMode(''));
        initState();
    }, [modalMode]);

    const onSave = useCallback(() => {
        if (busName.trim() === '') {
            notification['warning']({
                message: '버스명을 입력해 주세요.',
            });
            return;
        }
        if (busRoute === null) {
            notification['warning']({
                message: '버스 경로를 선택해 주세요.',
            });
            return;
        }
        if (busManager === null) {
            notification['warning']({
                message: '버스 관리자를 선택해 주세요.',
            });
            return;
        }
        let data: BusSaveRequest;
        if (idx) {
            data = {
                bus_idx: idx,
                bus_name: busName,
                bus_route_idx: busRoute,
                manager_idx: busManager,
                drive_yn: busYn,
            };
        } else {
            data = {
                bus_name: busName,
                bus_route_idx: busRoute,
                manager_idx: busManager,
                drive_yn: busYn,
            };
        }
        setLoading(true);
        dispatch(saveBus(data));
    }, [modalMode, idx, busName, busRoute, busManager, busYn]);

    useEffect(() => {
        if (saveSuccess) {
            dispatch(busSlice.actions.changeModalMode('save'));
            setLoading(false);
            notification['success']({
                message: '저장되었습니다.',
            });
            dispatch(busSlice.actions.changeInitState());
            initState();
        }
        if (saveFailure) {
            setLoading(false);
            notification['warning']({
                message: '저장에 실패했습니다.',
            });
            dispatch(busSlice.actions.changeInitState());
        }
    }, [saveSuccess, saveFailure]);

    const initState = () => {
        setOpen(false);
        setLoading(false);
        setIdx(null);
        setBusName('');
        setBusRoute(null);
        setBusManager(null);
        setBusYn('N');
    };

    return (
        <Modal
            title="버스 정보 입력"
            visible={modalMode !== ''}
            onOk={onSave}
            onCancel={onClose}
            okText={'저장'}
            cancelText={'취소'}
            width={800}
            confirmLoading={loading}>
            {idx && (
                <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
                    <Col span={4}>
                        <Typography.Text>버스 idx</Typography.Text>
                    </Col>
                    <Col span={5}>
                        <Input value={idx || ''} disabled />
                    </Col>
                </Row>
            )}
            <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
                <Col span={4}>
                    <Typography.Text>버스명</Typography.Text>
                </Col>
                <Col span={10}>
                    <Input value={busName || ''} placeholder="버스명" maxLength={20} onChange={onChangeBusName} />
                </Col>
                <Col span={10}>
                    <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                        {busName.length} / 20
                    </Typography.Text>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
                <Col span={4}>
                    <Typography.Text>버스 운행 경로</Typography.Text>
                </Col>
                <Col span={10}>
                    <Select
                        value={busRoute}
                        onChange={onChangeBusRoute}
                        placeholder={'버스 노선 선택'}
                        style={{ width: '100%' }}>
                        {routeRespData?.bus_route_list.map((option: BusRouteListType) => (
                            <Select.Option key={option.bus_route_idx} value={option.bus_route_idx}>
                                [{option.bus_route_idx}] {option.bus_route_name}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
                <Col span={4}>
                    <Typography.Text>버스 관리자</Typography.Text>
                </Col>
                <Col span={10}>
                    <Select
                        value={busManager}
                        onChange={onChangeBusManager}
                        placeholder={'버스 관리자 선택'}
                        style={{ width: '100%' }}>
                        {adminOptionList?.map((option: ObjectOption) => (
                            <Select.Option key={option.value} value={option.value}>
                                [{option.value}] {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
                <Col span={4}>
                    <Typography.Text>버스 운행 여부</Typography.Text>
                </Col>
                <Col span={20}>
                    <Radio.Group onChange={onChangeBusYn} value={busYn}>
                        <Radio.Button value={'Y'}>운행</Radio.Button>
                        <Radio.Button value={'N'}>미운행</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
        </Modal>
    );
};

export default BusDetailModal;
