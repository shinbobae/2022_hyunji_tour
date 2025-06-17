import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../../components/layouts/AppLayout';
import Title from '../../../components/container/Title';
import { useNavigate, useParams } from 'react-router';
import { Button, Col, Input, InputNumber, Modal, notification, Row, Select, Switch, Typography } from 'antd';
import useInput from '../../../hooks/useInput';
import useInputValue from '../../../hooks/useInputValue';
import EditTable from '../../../components/Table/EditTable';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import routeDetailSlice, { RouteLocationDataType } from '../../../store/slice/route/detail';
import CoordMap, { CoordiType } from '../../../components/Map/CoordMap';
import { Link } from 'react-router-dom';
import { getRoute, saveRoute, uploadRouteImage } from '../../../api/contents/busRoute/busRoute';
import { BusRouteSaveRequest } from '../../../api/contents/busRoute/busRouteType';
import UploadButton from '../../../components/UploadButton';

const RouteDetail = () => {
    let { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        dataLoading,
        dataFailure,
        routeDetailData,
        column,
        tableData,
        total,
        saveLoading,
        saveSuccess,
        saveFailure,
        uploadResponse,
        uploadFailure,
        uploadLoading,
    } = useAppSelector((state) => state.routeDetail);

    const [routeName, onChangeRouteName, setRouteName] = useInput<string>('');
    const [status, onChangeStatus, setStatus] = useInputValue<string | null>(null);

    const [selectedPoint, setSelectedPoint] = useState<React.Key[]>([]);
    const [coordinate, setCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
    const [coordiList, setCoordiList] = useState<CoordiType[]>([]);
    const [comfortableMode, setComfortableMode] = useState(false);
    const [clickRowKey, setClickRowKey] = useState<RouteLocationDataType | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [addYn, setAddYn] = useState(false);

    useEffect(() => {
        dispatch(routeDetailSlice.actions.resetState());
    }, []);
    useEffect(() => {
        console.log('id', id);
        if (id) {
            dispatch(getRoute(Number(id)));
        } else {
            setRouteName('');
            setStatus(null);
        }
    }, [id]);

    useEffect(() => {
        if (routeDetailData) {
            setRouteName(routeDetailData.bus_route_name);
            setImageUrl(routeDetailData.image_file_url || '');
            setStatus(routeDetailData.bus_route_status);
            onDrawLine();
        }
    }, [routeDetailData]);

    useEffect(() => {
        onDrawLine();
    }, [tableData]);

    useEffect(() => {
        if (uploadResponse) {
            setImageUrl(uploadResponse);
        }
    }, [uploadResponse]);

    const onSelectRow = useCallback(
        (key: React.Key[], row: RouteLocationDataType[]) => {
            setSelectedPoint(key);
        },
        [selectedPoint],
    );

    const onAddPoint = useCallback(
        (type: number) => {
            if (comfortableMode && type === 1 && coordinate === null) {
                notification['warning']({
                    message: '자동모드 상태에서는 우측 지도로 위치를 먼저 선택해 주세요.',
                    style: { wordBreak: 'keep-all' },
                });
                return;
            }
            let initData: RouteLocationDataType;
            if (comfortableMode) {
                if (coordinate === null) return;
                initData = {
                    key: `key-new${tableData.length + 1}`,
                    routeId: 0,
                    routeNo: tableData.length > 0 ? tableData.length + 1 : 1,
                    routeName: '',
                    description: '',
                    type: type.toString(),
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                    duration: '',
                    positionIdx: null,
                    bookmarkYn: 'N',
                };
            } else {
                initData = {
                    key: `key-new${tableData.length + 1}`,
                    routeId: 0,
                    routeNo: tableData.length > 0 ? tableData.length + 1 : 1,
                    routeName: '',
                    description: '',
                    type: type.toString(),
                    latitude:
                        tableData.length > 0
                            ? (Math.floor(tableData[tableData.length - 1].latitude * 1000000) - 500) / 1000000
                            : 37.556409,
                    longitude:
                        tableData.length > 0
                            ? (Math.floor(tableData[tableData.length - 1].longitude * 1000000) - 500) / 1000000
                            : 126.923244,
                    duration: '',
                    positionIdx: null,
                    bookmarkYn: 'N',
                };
            }
            const newData = [...tableData];
            newData.push(initData);
            setSelectedPoint([]);
            dispatch(routeDetailSlice.actions.changeTableData(newData));
            setAddYn(true);
            setTimeout(() => {
                setAddYn(false);
            }, 0);
        },
        [tableData, comfortableMode, coordinate],
    );

    const onDeletePoint = useCallback(() => {
        if (selectedPoint.length < 1) {
            notification['warning']({
                message: '삭제할 경로를 선택해 주세요.',
            });
            return;
        }
        let newData: RouteLocationDataType[];

        newData = [...tableData]
            .filter((item) => {
                for (let key of selectedPoint) {
                    if (item.key === key) {
                        return false;
                    }
                }
                return true;
            })
            .map((item, index) => {
                return { ...item, key: `key${index + 1}`, routeId: item.routeId };
            });
        setSelectedPoint([]);
        dispatch(routeDetailSlice.actions.changeTableData(newData));
    }, [selectedPoint, tableData]);

    const onDrawLine = useCallback(() => {
        let getCoordiList = tableData.map((coordi) => {
            let initArray = [];
            initArray.push(coordi.latitude);
            initArray.push(coordi.longitude);

            //return initArray;
            return {
                type: coordi.type,
                coordi: initArray,
            };
        });
        setCoordiList(getCoordiList);
    }, [tableData]);

    const onSave = useCallback(() => {
        if (routeName.trim() === '') {
            notification['warning']({
                message: '버스 노선 이름을 입력해 주세요.',
            });
            return;
        }
        if (status === '' || status === null) {
            notification['warning']({
                message: '경로 상태를 선택해 주세요.',
            });
            return;
        }
        if (imageUrl.trim() === '') {
            notification['warning']({
                message: '버스 노선 이미지를 등록해 주세요.',
            });
            return;
        }
        for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].routeName.trim() === '') {
                notification['warning']({
                    message: '경로 내의 모든 포인트의 이름을 입력해 주세요.',
                });
                return;
            }
        }
        let bookmarkYList = tableData.filter((item) => item.bookmarkYn === 'Y');
        if (bookmarkYList.length < 1) {
            notification['warning']({
                message: '경로 내의 북마크는 최소 한 개 이상 필요합니다.',
            });
            return;
        }
        if (bookmarkYList.length > 2) {
            notification['warning']({
                message: '경로 내의 북마크는 최대 두 개까지 설정할 수 있습니다.',
            });
            return;
        }
        const busStopCheck = tableData.find((item) => item.type === '2');
        if (!busStopCheck) {
            notification['warning']({
                message: '경로에는 한 개 이상의 정류장이 필요합니다.',
            });
            return;
        }

        let saveData: BusRouteSaveRequest = {
            bus_route_name: routeName,
            bus_route_status: status || '',
            image_file_url: imageUrl,
            bus_route_position_list: tableData.map((item: RouteLocationDataType, index) => ({
                bus_route_position_idx: item.positionIdx,
                bus_route_position_name: item.routeName,
                bus_route_position_description: item.description,
                bus_stop_idx: item.type === '2' ? (item.routeId !== 0 && item.routeId ? item.routeId : null) : null,
                location_seq_no: index + 1,
                location_lat: item.latitude,
                location_lon: item.longitude,
                bus_route_duration: Number(item.duration),
                bookmark_yn: item.bookmarkYn,
            })),
        };
        if (id && id !== '0') {
            saveData = {
                ...saveData,
                bus_route_idx: Number(id),
            };
        }
        console.log('saveData', saveData);
        dispatch(saveRoute(saveData));
    }, [id, routeName, status, imageUrl, tableData]);

    useEffect(() => {
        if (dataFailure) {
            notification['warning']({
                message: '데이터 불러오기에 실패했습니다.',
            });
        }
        if (saveSuccess) {
            notification['success']({
                message: '저장되었습니다.',
            });
        }
        if (saveFailure) {
            notification['warning']({
                message: '저장에 실패했습니다.',
            });
        }
        if (uploadFailure) {
            notification['warning']({
                message: '이미지 업로드에 실패했습니다.',
            });
        }
        dispatch(routeDetailSlice.actions.changeInitState());
    }, [routeDetailData, dataFailure, saveSuccess, saveFailure, uploadFailure]);

    const onChangeData = useCallback((data: RouteLocationDataType[]) => {
        dispatch(routeDetailSlice.actions.changeTableData(data));
    }, []);

    return (
        <AppLayout>
            <Title title={`Route`} subTitle={'버스 경로 관리'} />
            {/* route name, status */}
            <Row gutter={[16, 16]}>
                <Col md={12}>
                    <Typography.Text type="secondary">버스 노선명</Typography.Text>
                    <Input value={routeName} onChange={onChangeRouteName} placeholder="route name" />
                </Col>
                <Col md={6}>
                    <Typography.Text type="secondary">운행 상태</Typography.Text>
                    <Select
                        value={status}
                        onChange={onChangeStatus}
                        placeholder="Select status"
                        style={{ width: '100%' }}>
                        <Select.Option value={'1'}>운행</Select.Option>
                        <Select.Option value={'0'}>미운행</Select.Option>
                    </Select>
                </Col>
                <Col md={6} />
                <Col md={6}>
                    <Typography.Text type="secondary">버스 노선 이미지</Typography.Text>
                    <UploadButton
                        getImage={(image: any) => {
                            const formData = new FormData();
                            formData.append('img', image);
                            dispatch(uploadRouteImage(formData));
                        }}
                    />
                    <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                        이미지 사이즈 510x180 (px)
                    </Typography.Text>
                </Col>
                <Col span={14}>
                    {imageUrl !== '' && (
                        <img
                            src={imageUrl}
                            alt={'버스 경로 이미지'}
                            style={{
                                display: 'block',
                                maxWidth: '100%',
                                height: 'auto',
                                maxHeight: '300px',
                            }}
                        />
                    )}
                </Col>
            </Row>
            {/* route location list */}
            <Row gutter={[16, 16]} justify={`space-between`} style={{ marginTop: '2rem' }}>
                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        <Col md={14}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <Row align={'middle'} justify={'space-between'}>
                                    <Col>
                                        <Typography.Text type="secondary">버스 경로 목록</Typography.Text>
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
                                            onClick={() => onAddPoint(2)}>
                                            정류장 추가
                                        </Button>
                                        <Button style={{ marginRight: '0.5rem' }} onClick={() => onAddPoint(1)}>
                                            중간경로 추가
                                        </Button>
                                        <Button danger onClick={onDeletePoint}>
                                            선택 제거
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                            <EditTable
                                store={'route'}
                                column={column}
                                tableData={tableData}
                                total={total}
                                selectedRow={selectedPoint}
                                onSelectRow={onSelectRow}
                                onChangeData={onChangeData}
                                addYn={addYn}
                                onCheckRowKey={setClickRowKey}
                            />
                        </Col>
                        <Col span={10}>
                            <Row gutter={[16, 16]} align={'bottom'} style={{ marginBottom: '0.5rem' }}>
                                <Col span={8}>
                                    <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                        위도(latitude)
                                    </Typography.Text>
                                    <Input
                                        value={coordinate?.latitude || 0}
                                        onChange={onChangeRouteName}
                                        placeholder="위도(latitude)"
                                    />
                                </Col>
                                <Col span={8}>
                                    <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                        경도(longitude)
                                    </Typography.Text>
                                    <Input
                                        value={coordinate?.longitude || 0}
                                        onChange={onChangeRouteName}
                                        placeholder="경도(longitude)"
                                    />
                                </Col>
                            </Row>
                            <CoordMap
                                store={'route'}
                                lineShow={true}
                                tableData={tableData}
                                height={`780px`}
                                sendCoordi={setCoordinate}
                                getRoute={clickRowKey}
                            />
                        </Col>
                    </Row>
                </Col>

                <Col span={24} style={{ marginTop: '1rem', paddingBottom: '4rem', textAlign: 'right' }}>
                    <Link to={`/route`}>
                        <Button size={'large'} style={{ marginRight: '0.5rem' }}>
                            취소
                        </Button>
                    </Link>
                    <Button size={'large'} type="primary" loading={saveLoading} onClick={onSave}>
                        저장
                    </Button>
                </Col>
            </Row>
        </AppLayout>
    );
};

export default RouteDetail;
