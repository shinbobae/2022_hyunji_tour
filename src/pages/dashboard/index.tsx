import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import PageTitle from 'components/container/Title';
import useInputValue from '../../hooks/useInputValue';
import { Row, Col, Select, Typography, Button, notification } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import { getCityList } from '../../api/contents/city/city';
import { getRoute, getRouteList } from '../../api/contents/busRoute/busRoute';
import { fixBusLocationForce, getBusLocation } from '../../api/contents/bus/bus';
import CoordMap from '../../components/Map/CoordMap';
import citySlice from '../../store/slice/cirty/city';
import busSlice from '../../store/slice/bus/bus';
import routeSlice from '../../store/slice/route/route';
import routeDetailSlice from '../../store/slice/route/detail';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useInterval } from '../../hooks/useInterval';

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const { cityOptionList } = useAppSelector((state) => state.city);
    const { routeOptionList } = useAppSelector((state) => state.route);
    const { busLocationData, busLocationLoading, fixBusLocationLoading, fixBusLocationFailure, fixBusLocationSuccess } =
        useAppSelector((state) => state.bus);
    const { tableData } = useAppSelector((state) => state.routeDetail);
    const [cityIdx, onChangeCityIdx] = useInputValue<null | number>(null);
    const [routeIdx, onChangeRouteIdx] = useInputValue<null | number>(null); //(null);
    const [routeSelectMessage, setRouteSelectMessage] = useState('');
    const [busIdx, setBusIdx] = useState<number | null>(null);
    const [fixLocation, setFixLocation] = useState<{ lon: number; lat: number } | null>(null);

    useEffect(() => {
        dispatch(citySlice.actions.resetState());
        dispatch(routeSlice.actions.resetState());
        dispatch(busSlice.actions.resetState());
        dispatch(routeDetailSlice.actions.resetState());
        dispatch(getCityList({}));
        setBusIdx(null);
        setFixLocation(null);
    }, []);
    useEffect(() => {
        if (cityIdx) dispatch(getRouteList({ 'city-idx': cityIdx }));
    }, [cityIdx]);
    useEffect(() => {
        if (cityIdx) {
            if (cityOptionList.length > 0) {
                if (routeOptionList.length > 0) setRouteSelectMessage('버스 노선 선택');
                else setRouteSelectMessage('선택된 도시에 노선이 없습니다.');
            }
        } else setRouteSelectMessage('도시를 먼저 선택해 주세요.');
    }, [cityOptionList, routeOptionList]);
    useEffect(() => {
        if (routeIdx) {
            dispatch(getRoute(routeIdx));
            dispatch(getBusLocation({ 'bus-route-idx': routeIdx }));
        }
    }, [routeIdx]);

    useInterval(
        () => {
            if (routeIdx) {
                dispatch(busSlice.actions.resetState());
                dispatch(getBusLocation({ 'bus-route-idx': routeIdx }));
            }
        },
        routeIdx ? 10000 : null,
    );

    const onRefreshLocation = useCallback(() => {
        if (!routeIdx) {
            notification['warning']({ message: '경로를 선택해 주세요.' });
            return;
        }
        dispatch(getBusLocation({ 'bus-route-idx': routeIdx }));
    }, [routeIdx]);

    const onFixBusLocation = useCallback(() => {
        if (!busIdx) {
            notification['warning']({
                message: '노선 위 운행 중인 버스를 선택해 주세요.',
                style: { wordBreak: 'keep-all' },
            });
            return;
        }
        if (!fixLocation) {
            notification['warning']({
                message: '버스위치를 수정할 경로 또는 정류장을 선택해 주세요.',
                style: { wordBreak: 'keep-all' },
            });
            return;
        }
        dispatch(fixBusLocationForce({ busIdx: busIdx, lon: fixLocation.lon, lat: fixLocation.lat }));
    }, [busIdx, fixLocation]);

    useEffect(() => {
        if (fixBusLocationFailure) {
            notification['warning']({ message: '버스 위치 수정에 실패했습니다.' });
        }
        if (fixBusLocationSuccess) {
            notification['success']({ message: '버스 위치가 수정되었습니다.' });
            setBusIdx(null);
            setFixLocation(null);
            if (routeIdx) dispatch(getBusLocation({ 'bus-route-idx': routeIdx }));
        }
        dispatch(busSlice.actions.changeInitState());
    }, [routeIdx, fixBusLocationFailure, fixBusLocationSuccess]);

    return (
        <AppLayout>
            <PageTitle title={`Dashboard`} subTitle={`현지투어닷컴`} />
            <Typography.Title level={4}>실시간 버스 현황</Typography.Title>
            <Row gutter={[16, 16]} justify={'space-between'} align={'bottom'}>
                <Col md={12}>
                    <Row gutter={[16, 16]}>
                        <Col md={12}>
                            <Typography.Text type="secondary">도시 선택</Typography.Text>
                            <Select
                                value={cityIdx}
                                onChange={onChangeCityIdx}
                                style={{ width: '100%' }}
                                placeholder={'도시 선택'}>
                                {cityOptionList.map((option) => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col md={12}>
                            <Typography.Text type="secondary">버스 노선 선택</Typography.Text>
                            <Select
                                value={routeIdx}
                                onChange={onChangeRouteIdx}
                                style={{ width: '100%' }}
                                placeholder={routeSelectMessage}>
                                {routeOptionList?.map((option) => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Button
                        size={'large'}
                        loading={fixBusLocationLoading}
                        onClick={onFixBusLocation}
                        style={{ marginRight: '0.5rem' }}>
                        버스위치조정
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        size={'large'}
                        type={'primary'}
                        loading={busLocationLoading}
                        onClick={onRefreshLocation}
                    />
                </Col>
                <Col md={24}>
                    <CoordMap
                        store={'route'}
                        tableData={tableData}
                        lineShow={true}
                        currentLocationList={busLocationData}
                        currentBus={busIdx}
                        setCurrentBus={setBusIdx}
                        fixLocation={fixLocation}
                        setFixLocation={setFixLocation}
                    />
                </Col>
            </Row>
        </AppLayout>
    );
};

export default Dashboard;
