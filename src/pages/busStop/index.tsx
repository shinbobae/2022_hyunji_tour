import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from 'components/layouts/AppLayout';
import Title from 'components/container/Title';
import { Button, Col, Input, notification, Row, Switch, Typography } from 'antd';
import EditTable from 'components/Table/EditTable';
import { useAppDispatch, useAppSelector } from 'hooks/useToolkit';
import { RouteLocationDataType } from 'store/slice/route/detail';
import CoordMap, { CoordiType } from 'components/Map/CoordMap';
import busStopSlice, { BusStopDataType } from '../../store/slice/busStop/busStop';
import { getBusStopList, saveBusStop } from '../../api/contents/busStop/busStop';
import { BusStopPostItem } from '../../api/contents/busStop/busStopType';
import { InfoCircleOutlined } from '@ant-design/icons';

const BusStopSetting = () => {
    const dispatch = useAppDispatch();
    const { column, busStopList, total, saveLoading, saveSuccess, saveFailure } = useAppSelector(
        (state) => state.busStop,
    );

    const [selectedPoint, setSelectedPoint] = useState<React.Key[]>([]);
    const [coordinate, setCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
    const [coordiList, setCoordiList] = useState<CoordiType[]>([]);

    const [addYn, setAddYn] = useState(false);

    const [comfortableMode, setComfortableMode] = useState(false);
    const [clickRowKey, setClickRowKey] = useState<BusStopDataType | null>(null);

    useEffect(() => {
        initData();
    }, []);

    const initData = useCallback(() => {
        dispatch(busStopSlice.actions.resetState());
        dispatch(getBusStopList());
    }, []);

    const onSelectRow = useCallback(
        (key: React.Key[], row: RouteLocationDataType[]) => {
            setSelectedPoint(key);
        },
        [selectedPoint],
    );

    const onAddBusStop = useCallback(() => {
        if (comfortableMode && coordinate === null) {
            notification['warning']({
                message: '자동모드 상태에서는 우측 지도로 위치를 먼저 선택해 주세요.',
                style: { wordBreak: 'keep-all' },
            });
            return;
        }
        let initData: BusStopDataType;
        if (comfortableMode) {
            if (coordinate === null) return;
            initData = {
                key: `key-new${busStopList.length + 1}`,
                routeNo: busStopList.length + 1,
                useYn: 'N',
                routeName: '',
                description: '',
                location: '',
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                cityIdx: 0,
                cityName: '',
            };
        } else {
            initData = {
                key: `key-new${busStopList.length + 1}`,
                routeNo: busStopList.length + 1,
                useYn: 'N',
                routeName: '',
                description: '',
                location: '',
                latitude:
                    busStopList.length > 0
                        ? (Math.floor(busStopList[busStopList.length - 1].latitude * 1000000) - 500) / 1000000
                        : 37.556409,
                longitude:
                    busStopList.length > 0
                        ? (Math.floor(busStopList[busStopList.length - 1].longitude * 1000000) - 500) / 1000000
                        : 126.923244,
                cityIdx: 0,
                cityName: '',
            };
        }
        const newData = [...busStopList];
        newData.push(initData);
        setSelectedPoint([]);
        dispatch(busStopSlice.actions.changeTableData(newData));
        setAddYn(true);
        setTimeout(() => {
            setAddYn(false);
        }, 0);
    }, [busStopList, comfortableMode, coordinate]);

    const onDeletePoint = useCallback(() => {
        if (selectedPoint.length < 1) {
            notification['warning']({
                message: '삭제할 정류장을 선택해 주세요.',
            });
            return;
        }
        let newData: any[];

        newData = [...busStopList]
            .filter((item) => {
                for (let key of selectedPoint) {
                    if (item.key === key) {
                        return false;
                    }
                }
                return true;
            })
            .map((item, index) => {
                return { ...item, key: `key${index + 1}`, routeNo: index + 1 };
            });
        dispatch(busStopSlice.actions.changeTableData(newData));
        setSelectedPoint([]);
    }, [selectedPoint, busStopList]);

    const onDrawLine = useCallback(() => {
        let getCoordiList = busStopList.map((coordi) => {
            let initArray = [];
            initArray.push(coordi.latitude);
            initArray.push(coordi.longitude);

            return {
                type: 2,
                coordi: initArray,
            };
        });
        setCoordiList(getCoordiList);
    }, [busStopList]);

    const onChangeData = useCallback((data: BusStopDataType[]) => {
        dispatch(busStopSlice.actions.changeTableData(data));
    }, []);

    const onSave = useCallback(() => {
        console.log('save', busStopList);
        for (let i = 0; i < busStopList.length; i++) {
            if (busStopList[i].routeName.trim() === '') {
                notification['warning']({
                    message: '정류장의 이름을 모두 입력해 주세요.',
                });
                return;
            }
            if (busStopList[i].cityIdx === 0) {
                notification['warning']({
                    message: '정류장의 도시를 모두 선택해 주세요.',
                });
                return;
            }
        }

        const data: BusStopPostItem[] = busStopList.map((item) => {
            if (!item.routeId || item.routeId === 0) {
                return {
                    bus_stop_name: item.routeName,
                    location_name: '',
                    bus_stop_description: '',
                    city_idx: item.cityIdx,
                    city_name: item.cityName,
                    location_lat: item.latitude,
                    location_lon: item.longitude,
                };
            } else {
                return {
                    bus_stop_idx: item.routeId,
                    bus_stop_name: item.routeName,
                    location_name: '',
                    bus_stop_description: '',
                    city_idx: item.cityIdx,
                    city_name: item.cityName,
                    location_lat: item.latitude,
                    location_lon: item.longitude,
                };
            }
        });
        console.log('bus stop save', data);
        dispatch(saveBusStop({ bus_stop_list: data }));
    }, [busStopList]);

    useEffect(() => {
        if (saveSuccess) {
            notification['success']({
                message: '저장되었습니다.',
            });
            initData();
        }
        if (saveFailure) {
            notification['warning']({
                message: '저장 실패했습니다.',
            });
            dispatch(busStopSlice.actions.changeInitState());
        }
    }, [saveSuccess, saveFailure]);

    return (
        <AppLayout>
            <Title title={`Bus Stop`} subTitle={`버스 정류장 관리`} />
            <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                <InfoCircleOutlined />
                &nbsp; 목록 수정 후 최하단 저장 버튼으로 저장 하셔야 데이터가 유지됩니다.
            </Typography.Text>
            {/* route location list */}
            <Row justify={`space-between`} style={{ marginTop: '2rem' }}>
                <Col md={24} style={{ marginBottom: '0.5rem' }}>
                    <Row gutter={[16, 16]}>
                        <Col md={12}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <Row align={'middle'} justify={'space-between'} style={{ marginRight: '0.5rem' }}>
                                    <Col>
                                        <Typography.Text type="secondary">버스 정류장 목록</Typography.Text>
                                    </Col>
                                    <Col>
                                        <span style={{ fontSize: '0.9rem' }}>자동모드&nbsp;&nbsp;</span>
                                        <Switch
                                            checkedChildren={`ON`}
                                            unCheckedChildren={`OFF`}
                                            checked={comfortableMode}
                                            onChange={() => setComfortableMode((comfortableMode) => !comfortableMode)}
                                        />
                                        <Button
                                            style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
                                            onClick={onAddBusStop}>
                                            정류장 추가
                                        </Button>
                                        <Button danger onClick={onDeletePoint}>
                                            정류장 제거
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                            <EditTable
                                store={'busStop'}
                                column={column}
                                tableData={busStopList}
                                total={total}
                                selectedRow={selectedPoint}
                                onSelectRow={onSelectRow}
                                onChangeData={onChangeData}
                                addYn={addYn}
                                onCheckRowKey={setClickRowKey}
                            />
                        </Col>
                        <Col span={12}>
                            <Row
                                gutter={[16, 16]}
                                align={'bottom'}
                                style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
                                <Col span={8}>
                                    <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                        위도(latitude)
                                    </Typography.Text>
                                    <Input value={coordinate?.latitude || 0} readOnly placeholder="위도(latitude)" />
                                </Col>
                                <Col span={8}>
                                    <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                        경도(longitude)
                                    </Typography.Text>
                                    <Input value={coordinate?.longitude || 0} readOnly placeholder="경도(longitude)" />
                                </Col>
                                <Col span={24}>
                                    <CoordMap
                                        store={`busStop`}
                                        lineShow={false}
                                        height={`700px`}
                                        tableData={busStopList}
                                        sendCoordi={setCoordinate}
                                        getRoute={clickRowKey}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>

                <Col span={24} style={{ paddingBottom: '2rem', textAlign: 'right' }}>
                    <Button size={'large'} type="primary" loading={saveLoading} onClick={onSave}>
                        저장
                    </Button>
                </Col>
            </Row>
        </AppLayout>
    );
};

export default BusStopSetting;
