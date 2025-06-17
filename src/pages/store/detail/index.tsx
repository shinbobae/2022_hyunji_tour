import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '../../../components/layouts/AppLayout';
import { useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import Title from '../../../components/container/Title';
import { Button, Col, Input, notification, Row, Select, TimePicker, Typography } from 'antd';
import useInput from '../../../hooks/useInput';
import useInputValue from '../../../hooks/useInputValue';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { CheckboxButton } from '../../../assets/style/CheckboxButton';
import moment, { Moment } from 'moment';
import Uploader from '../../../components/Uploader';
import ImageList from '../../../components/container/ImageList';
import EditTable from '../../../components/Table/EditTable';
import storeDetailSlice, { StoreDetailDataType } from '../../../store/slice/store/detail';
import ReservationTable from './ReservationTable';
import { Link } from 'react-router-dom';
import { getStore, getStoreCategory, saveStore } from '../../../api/contents/store/store';
import { ObjectOption } from '../../../api/type';
import { StoreSaveRequest } from '../../../api/contents/store/storeType';
import CoordMap from '../../../components/Map/CoordMap';
import citySlice from '../../../store/slice/cirty/city';
import { getCityList } from '../../../api/contents/city/city';

const StoreDetail = () => {
    let { id } = useParams();
    const dispatch = useAppDispatch();
    const { column, tableData, total, detailData, storeCategoryOptionList, saveSuccess, saveFailure } = useAppSelector(
        (state) => state.storeDetail,
    );
    const { cityOptionList } = useAppSelector((state) => state.city);

    const [name, onChangeName, setName] = useInput('');
    const [category, onChangeCategory, setCategory] = useInputValue(0);
    const [status, onChangeStatus, setStatus] = useInputValue(0);
    const [city, onChangeCity, setCity] = useInputValue<ObjectOption>({ value: 0, label: '' });
    const [address, onChangeAddress, setAddress] = useInput('');
    const [phone, onChangePhone, setPhone] = useInput('');
    const [coordinate, setCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
    const [desc, onChangeDesc, setDesc] = useInput('');
    const [startTime, setStartTime] = useState('00:00:00');
    const [endTime, setEndTime] = useState('00:00:00');
    const [day, setDay] = useState('0000000');
    const [imageList, setImageList] = useState<string[]>([]);
    const [tzid, setTzid] = useState('');

    const [selectedGoods, setSelectedGoods] = useState<React.Key[]>([]);
    const [saveLoading, setSaveLoading] = useState(false);

    const [addYn, setAddYn] = useState(false);

    useEffect(() => {
        dispatch(storeDetailSlice.actions.resetState());
        dispatch(citySlice.actions.resetState());
        dispatch(getStoreCategory());
        dispatch(getCityList({}));
        if (id) {
            console.log('asdasd', id);
            dispatch(getStore(Number(id)));
        }
    }, [id]);

    useEffect(() => {
        if (detailData) {
            setName(detailData.store_name);
            setCategory(detailData.store_category_idx);
            setCity({ label: detailData.city_name, value: detailData.city_idx });
            setAddress(detailData.store_address || '');
            // setStatus(detailData.store_biz_yn === 'Y' ? 2 : 1);
            setPhone(detailData.store_phone);
            setCoordinate({ latitude: detailData.store_location_lat, longitude: detailData.store_location_lon });
            setDesc(detailData.store_description);
            setStartTime(detailData.store_biz_time_from);
            setEndTime(detailData.store_biz_time_to);
            setDay(detailData.store_biz_day);
            setImageList(detailData.image_list);
            setTzid(detailData.store_biz_time_zone_id);
        }
    }, [detailData]);

    const onChangeDay = useCallback(
        (e: CheckboxChangeEvent, index: number) => {
            const newArray = day.split('');
            if (e.target.checked) {
                newArray[index] = '1';
            } else {
                newArray[index] = '0';
            }
            setDay(newArray.join(''));
        },
        [day],
    );

    const onSelectRow = useCallback(
        (key: React.Key[], row: StoreDetailDataType[]) => {
            setSelectedGoods(key);
        },
        [selectedGoods],
    );
    const onChangeData = useCallback(
        (data: StoreDetailDataType[]) => {
            dispatch(storeDetailSlice.actions.changeTableData(data));
        },
        [tableData],
    );
    const onDeleteGoods = useCallback(() => {
        if (selectedGoods.length < 1) {
            notification['warning']({
                message: '삭제할 상품을 선택해 주세요.',
            });
            return;
        }
        let newData: StoreDetailDataType[];
        newData = [...tableData].filter((item) => {
            for (let key of selectedGoods) {
                if (item.key === key) {
                    return false;
                }
            }
            return true;
        });
        setSelectedGoods([]);
        onChangeData(newData);
    }, [selectedGoods, tableData]);
    const onAddGoods = useCallback(() => {
        const initData: StoreDetailDataType = {
            key: `key-new${tableData.length + 1}`,
            //goodsId: null,
            goodsName: ``,
            goodsType: 0,
            goodsPrice: '',
            goodsCurrency: 0,
            maximum: 0,
            packageYn: 'N',
        };
        const newData = [...tableData];
        newData.push(initData);
        setSelectedGoods([]);
        onChangeData(newData);
        setAddYn(true);
        setTimeout(() => {
            setAddYn(false);
        }, 0);
    }, [tableData]);
    const onChangeStartTime = useCallback(
        (value: any, string: string) => {
            console.log('asdsd', value);
            setStartTime(string);
        },
        [startTime],
    );
    const onChangeEndTime = useCallback(
        (value: any, string: string) => {
            setEndTime(string);
        },
        [startTime],
    );
    const getImage = useCallback(
        (image: string) => {
            setImageList([...imageList, image]);
        },
        [imageList],
    );
    const onSave = useCallback(() => {
        if (name === '') {
            notification['warning']({
                message: '가게명을 입력해 주세요.',
            });
            return;
        }
        if (category === 0) {
            notification['warning']({
                message: '가게 카테고리를 선택해 주세요.',
            });
            return;
        }
        if (city.value === 0) {
            notification['warning']({
                message: '도시를 선택해 주세요.',
            });
            return;
        }
        if (address.trim() === '') {
            notification['warning']({
                message: '주소를 입력해 주세요.',
            });
            return;
        }
        if (coordinate === null) {
            notification['warning']({
                message: '지도에서 가게 위치를 설정해 주세요.',
            });
            return;
        }
        if (phone === '') {
            notification['warning']({
                message: '가게 전화번호를 입력해 주세요.',
            });
            return;
        }
        if (day === '0000000') {
            notification['warning']({
                message: '가게 영업 요일을 확인해 주세요.',
            });
            return;
        }
        if (tableData.length < 1) {
            notification['warning']({
                message: `상품을 한 개 이상 등록해 주세요.`,
            });
            return;
        } else {
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i].goodsName.trim() === '') {
                    notification['warning']({
                        message: `상품명을 모두 입력해 주세요.`,
                    });
                    return false;
                }
                if (tableData[i].goodsType === 0) {
                    notification['warning']({
                        message: `상품 타입을 모두 선택해 주세요.`,
                    });
                    return false;
                }
                if (tableData[i].goodsPrice === '') {
                    notification['warning']({
                        message: `상품 가격을 모두 입력해 주세요.`,
                    });
                    return false;
                }
                if (tableData[i].goodsCurrency === 0) {
                    notification['warning']({
                        message: `상품 화폐 단위를 모두 선택해 주세요.`,
                    });
                    return false;
                }
                if (tableData[i].maximum.toString().trim() === '') {
                    notification['warning']({
                        message: `상품 최대 판매 수를 입력해 주세요.`,
                    });
                    return false;
                }
            }
        }

        let data: StoreSaveRequest;
        if (id) {
            data = {
                store_idx: Number(id),
                store_name: name,
                city_idx: Number(city.value),
                city_name: city.label,
                store_address: address,
                store_phone: phone,
                store_description: desc,
                store_category_idx: category,
                store_biz_time_from: startTime,
                store_biz_time_to: endTime,
                store_biz_day: day,
                // store_biz_yn: status === 2 ? 'Y' : 'N',
                store_location_lat: coordinate.latitude,
                store_location_lon: coordinate.longitude,
                goods_list: tableData.map((item) => {
                    if (item.goodsId) {
                        return {
                            goods_idx: item.goodsId,
                            goods_name: item.goodsName ? item.goodsName : '',
                            goods_price: item.goodsPrice,
                            goods_type_idx: item.goodsType,
                            currency_idx: item.goodsCurrency,
                            max_booking_cnt: Number(item.maximum),
                            package_goods_yn: item.packageYn,
                        };
                    } else {
                        return {
                            goods_name: item.goodsName ? item.goodsName : '',
                            goods_price: item.goodsPrice,
                            goods_type_idx: item.goodsType,
                            currency_idx: item.goodsCurrency,
                            max_booking_cnt: Number(item.maximum),
                            package_goods_yn: item.packageYn,
                        };
                    }
                }),
                image_list: imageList,
                store_biz_time_zone_id: tzid,
            };
        } else {
            data = {
                store_name: name,
                city_idx: Number(city.value),
                city_name: city.label,
                store_address: address,
                store_phone: phone,
                store_description: desc,
                store_category_idx: category,
                store_biz_time_from: startTime,
                store_biz_time_to: endTime,
                store_biz_day: day,
                // store_biz_yn: status === 2 ? 'Y' : 'N',
                store_location_lat: coordinate.latitude,
                store_location_lon: coordinate.longitude,
                goods_list: tableData.map((item) => {
                    return {
                        goods_name: item.goodsName ? item.goodsName : '',
                        package_goods_yn: item.packageYn,
                        goods_price: item.goodsPrice,
                        goods_type_idx: item.goodsType,
                        currency_idx: item.goodsCurrency,
                        max_booking_cnt: Number(item.maximum),
                    };
                }),
                image_list: imageList,
                store_biz_time_zone_id: tzid,
            };
        }
        console.log('save', data);
        dispatch(saveStore(data));
        setSaveLoading(true);
    }, [
        id,
        name,
        category,
        status,
        coordinate,
        tzid,
        city,
        address,
        phone,
        desc,
        startTime,
        endTime,
        day,
        tableData,
        imageList,
    ]);

    useEffect(() => {
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
        setSaveLoading(false);
        dispatch(storeDetailSlice.actions.changeInitState());
    }, [saveSuccess, saveFailure]);

    return (
        <AppLayout>
            <Title title={`Store`} subTitle={`스토어 관리`} />
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Typography.Text type="secondary">스토어 이름</Typography.Text>
                    <Input value={name} onChange={onChangeName} placeholder="store name" />
                </Col>
                <Col span={6}>
                    <Typography.Text type="secondary">스토어 카테고리</Typography.Text>
                    <Select value={category} onChange={onChangeCategory} style={{ width: '100%' }}>
                        <Select.Option value={0} disabled>
                            가게 카테고리 선택
                        </Select.Option>
                        {storeCategoryOptionList?.map((item: ObjectOption) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col span={6} />
                <Col span={6}>
                    <Typography.Text type="secondary">도시 선택</Typography.Text>
                    <Select
                        value={{ value: city.value, label: city.label === '' ? '도시를 선택해 주세요.' : city.label }}
                        onChange={onChangeCity}
                        labelInValue
                        style={{ width: '100%' }}>
                        <Select.Option value={0} disabled>
                            도시를 선택해 주세요.
                        </Select.Option>
                        {cityOptionList?.map((item: ObjectOption) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col span={18} />
                <Col span={18}>
                    <Typography.Text type="secondary">주소</Typography.Text>
                    <Input value={address} onChange={onChangeAddress} placeholder="store address" />
                </Col>
                <Col span={6}>
                    <Typography.Text type="secondary">연락처</Typography.Text>
                    <Input value={phone} onChange={onChangePhone} placeholder="000-0000-00-0" />
                </Col>

                <Col span={6}>
                    <Typography.Text type="secondary">위도(latitude)</Typography.Text>
                    <Input value={coordinate?.latitude || ''} readOnly placeholder="위도(latitude)" />
                </Col>
                <Col span={6}>
                    <Typography.Text type="secondary">경도(longitude)</Typography.Text>
                    <Input value={coordinate?.longitude || ''} readOnly placeholder="경도(longitude)" />
                </Col>
                <Col span={12}>
                    <CoordMap
                        store={'nonClick'}
                        lineShow={false}
                        tableData={coordinate === null ? [] : [coordinate]}
                        sendCoordi={setCoordinate}
                        setTzid={setTzid}
                        height={'400px'}
                    />
                </Col>
                <Col span={24}>
                    <Typography.Text type="secondary">스토어 설명</Typography.Text>
                    <Input.TextArea value={desc} onChange={onChangeDesc} placeholder="description" rows={3} />
                </Col>
                <Col span={6}>
                    <Typography.Text type="secondary">여는 시간</Typography.Text>
                    <TimePicker
                        value={moment(startTime, 'HH:mm:ss')}
                        format={'HH:mm:ss'}
                        onChange={onChangeStartTime}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={6}>
                    <Typography.Text type="secondary">닫는 시간</Typography.Text>
                    <TimePicker
                        value={moment(endTime, 'HH:mm:ss')}
                        format={'HH:mm:ss'}
                        onChange={onChangeEndTime}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={12}>
                    <Typography.Text type="secondary">영업 요일</Typography.Text>
                    <div>
                        {day.split('').map((item, index) => (
                            <CheckboxButton
                                key={`chk${index}`}
                                checked={day[index] === '1'}
                                onChange={(e) => onChangeDay(e, index)}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                            </CheckboxButton>
                        ))}
                    </div>
                </Col>
                <Col span={24}>
                    <Typography.Text type="secondary">스토어 이미지</Typography.Text>
                    <Row gutter={[16, 16]}>
                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Uploader category={'store'} getImage={getImage} />
                            {imageList.length > 0 && (
                                <Button onClick={() => setImageList([])} style={{ marginTop: '0.5rem' }} danger>
                                    전체 지우기
                                </Button>
                            )}
                        </Col>
                        <Col span={18}>
                            <ImageList imageList={imageList} setImageList={setImageList} />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <Col span={24}>
                    <Typography.Text type="secondary">스토어 상품 목록</Typography.Text>
                </Col>
                <Col span={24}>
                    <Button style={{ marginRight: '0.5rem' }} onClick={onAddGoods}>
                        상품 추가
                    </Button>
                    <Button danger onClick={onDeleteGoods}>
                        상품 삭제
                    </Button>
                </Col>
                <Col span={24}>
                    <EditTable
                        store={'storeDetail'}
                        column={column}
                        tableData={tableData}
                        total={total}
                        selectedRow={selectedGoods}
                        onSelectRow={onSelectRow}
                        onChangeData={onChangeData}
                        addYn={addYn}
                    />
                </Col>
                <Col span={24} style={{ marginTop: '1rem', paddingBottom: '4rem', textAlign: 'right' }}>
                    <Link to={`/store`}>
                        <Button size={'large'} style={{ marginRight: '0.5rem' }}>
                            취소
                        </Button>
                    </Link>
                    <Button size={'large'} type="primary" onClick={onSave} loading={saveLoading}>
                        저장
                    </Button>
                </Col>
            </Row>
            {id && <ReservationTable id={id} lang={tzid} />}
        </AppLayout>
    );
};

export default StoreDetail;
