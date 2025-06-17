import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../../../components/layouts/AppLayout';
import Title from '../../../components/container/Title';
import { Row, Col, Input, Typography, Collapse, Select, notification, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import useInput from '../../../hooks/useInput';
import useInputValue from '../../../hooks/useInputValue';
import Uploader from '../../../components/Uploader';
import PackageCollapse from './PackageCollapse';
import { getPackage, savePackage } from '../../../api/contents/package/package';
import { AddPackageRequest, EditPackageRequest, PackageGoodsItem } from '../../../api/contents/package/packageType';
import { ObjectOption } from '../../../api/type';
import { getCurrencyType } from '../../../api/contents/store/store';
import packageSlice from '../../../store/slice/package/package';

const PackageDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { detailData, detailFailure, detailLoading, detailSuccess, saveLoading, saveSuccess, saveFailure } =
        useAppSelector((state) => state.package);
    const { storeCurrencyOptionList } = useAppSelector((state) => state.storeDetail);
    const [idx, setIdx] = useState<number | null>(null);
    const [name, onChangeName, setName] = useInput('');
    const [price, onChangePrice, setPrice] = useInput('');
    const [currency, onChangeCurrency, setCurrency] = useInputValue<ObjectOption | null>(null);
    const [desc, onChangeDesc, setDesc] = useInput('');
    const [count, onChangeCount, setCount] = useInput(1);
    const [image, setImage] = useState('');
    const [packageData, setPackageData] = useState<(PackageGoodsItem & { package_idx?: number })[]>([]);

    useEffect(() => {
        dispatch(getCurrencyType());
    }, []);
    useEffect(() => {
        if (location.state && typeof location.state === 'number') {
            dispatch(getPackage(location.state));
        }
    }, [location]);

    useEffect(() => {
        if (detailData) {
            setIdx(detailData.package_idx);
            setName(detailData.package_name);
            setPrice(detailData.package_price);
            setCurrency({ label: detailData.currency_name, value: detailData.currency_idx });
            setDesc(detailData.package_description);
            setCount(detailData.goods_order_max_booking_cnt || 1);
            setImage(detailData.package_image_url);
            setPackageData(
                detailData.package_goods_info_list.map((item) => ({
                    store_category_idx: item.store_category_idx,
                    store_category_name: item.store_category_name,
                    store_category_order: item.store_category_order,
                    store_idx: item.store_idx,
                    store_name: item.store_name,
                    goods_idx: item.goods_idx,
                    goods_name: item.goods_name,
                    goods_type_idx: item.goods_type_idx,
                    goods_type_name: item.goods_type_name,
                })),
            );
        }
    }, [detailData]);

    const onAddCategory = useCallback(() => {
        const initData: PackageGoodsItem = {
            store_category_idx: 0,
            store_category_name: '',
            store_category_order: packageData.length + 1,
            store_idx: idx ? idx : 0,
            store_name: '',
            goods_idx: 0,
            goods_name: '',
            goods_type_idx: 0,
            goods_type_name: '',
        };
        setPackageData([...packageData, initData]);
    }, [idx, packageData]);

    const onSave = useCallback(() => {
        if (name.trim() === '') {
            notification['warning']({ message: '패키지명을 입력해 주세요.' });
            return;
        }
        if (price.trim() === '') {
            notification['warning']({ message: '패키지 가격을 입력해 주세요.' });
            return;
        }
        if (currency === null) {
            notification['warning']({ message: '화폐단위를 선택해 주세요.' });
            return;
        }
        if (image.trim() === '') {
            notification['warning']({ message: '패키지 대표 이미지를 선택해 주세요.' });
            return;
        }
        if (packageData.length < 1) {
            notification['warning']({ message: '패키지 카테고리를 한 개 이상 설정해 주세요.' });
        }
        if (idx === null) {
            //add
            const data: AddPackageRequest = {
                package_name: name,
                package_description: desc,
                package_price: price,
                currency_idx: Number(currency.value),
                currency_name: currency.label,
                goods_order_max_booking_cnt: count,
                package_goods_info_list: packageData,
                image_file_url: image,
            };
            console.log('ADD', data);
            dispatch(savePackage(data));
        } else {
            //edit
            const data: EditPackageRequest = {
                package_idx: idx,
                package_name: name,
                package_description: desc,
                package_price: price,
                currency_idx: Number(currency.value),
                currency_name: currency.label,
                goods_order_max_booking_cnt: count,
                package_goods_info_list: packageData,
                image_file_url: image,
            };
            dispatch(savePackage(data));
        }
    }, [idx, name, price, currency, count, desc, image, packageData]);

    useEffect(() => {
        if (detailFailure) {
            notification['warning']({ message: '패키지 조회에 실패했습니다.' });
            navigate('/package');
        }
        if (saveSuccess) {
            notification['success']({ message: '저장되었습니다.' });
            if (idx === null) {
                navigate('/package');
            }
        }
        if (saveFailure) {
            notification['warning']({ message: '저장에 실패했습니다. ' });
        }
        dispatch(packageSlice.actions.changeInitState());
    }, [idx, detailFailure, detailLoading, detailSuccess, saveLoading, saveSuccess, saveFailure]);
    return (
        <AppLayout>
            <Title title={`Package`} subTitle={`패키지 ${location.state ? 'Edit' : 'Create'}`} />
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Typography.Text type="secondary">패키지명</Typography.Text>
                    <Input value={name} onChange={onChangeName} placeholder={'패키지명'} />
                </Col>
                <Col span={4}>
                    <Typography.Text type="secondary">패키지 가격</Typography.Text>
                    <Input
                        value={price}
                        onChange={(e) => {
                            const reg = /^-?\d*(\.\d*)?$/;
                            if (!reg.test(e.target.value)) {
                                notification['warning']({
                                    key: 'alert',
                                    message: '숫자로 입력해 주세요.',
                                });
                                return;
                            } else {
                                onChangePrice(e);
                            }
                        }}
                        placeholder={'00000'}
                    />
                </Col>
                <Col span={4}>
                    <Typography.Text type="secondary">화폐 단위</Typography.Text>
                    <Select value={currency} onChange={onChangeCurrency} labelInValue style={{ width: '100%' }}>
                        <Select.Option value={0} disabled>
                            화폐 선택
                        </Select.Option>
                        {storeCurrencyOptionList.map((item) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col span={12}>
                    <Typography.Text type="secondary">패키지 설명</Typography.Text>
                    <Input value={desc} onChange={onChangeDesc} placeholder={'설명'} />
                </Col>
                <Col span={6}>
                    <Typography.Text type="secondary">패키지 이미지</Typography.Text>
                    <Uploader category={'package'} getImage={(image: string) => setImage(image)} />
                </Col>
                <Col span={6}>
                    {image !== '' && (
                        <img
                            src={image}
                            alt={name || '패키지 이미지'}
                            style={{
                                display: 'block',
                                width: '100%',
                                maxWidth: '350px',
                                height: 'auto',
                                maxHeight: '250px',
                            }}
                        />
                    )}
                </Col>
                <Col span={24}>
                    <Row justify={'space-between'} style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                        <Typography.Text type="secondary">패키지 카테고리 설정</Typography.Text>
                        <Button onClick={onAddCategory}>카테고리 추가</Button>
                    </Row>
                    <PackageCollapse data={packageData} setData={setPackageData} />
                </Col>
            </Row>
            <Row justify={'end'} style={{ padding: '3rem 0' }}>
                <Button size={'large'} onClick={() => navigate('/package')}>
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

export default PackageDetail;
