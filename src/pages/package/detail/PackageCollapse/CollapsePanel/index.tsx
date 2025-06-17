import React, { useCallback, useEffect, useState } from 'react';
import { Col, notification, Row, Select, Typography } from 'antd';
import { PackageGoodsItem } from 'api/contents/package/packageType';
import { useAppDispatch, useAppSelector } from 'hooks/useToolkit';
import { getGoodsType, getStoreCategory } from 'api/contents/store/store';
import { ObjectOption } from '../../../../../api/type';
import { GoodsListItem, StoreListItem } from '../../../../../api/contents/store/storeType';
import api_common from '../../../../../api/api-common';
import { toQueryString } from '../../../../../api/toQueryString';

type Props = {
    index: number;
    dataList: (PackageGoodsItem & { package_idx?: number })[];
    data: PackageGoodsItem & { package_idx?: number };
    setData: React.Dispatch<React.SetStateAction<(PackageGoodsItem & { package_idx?: number })[]>>;
};
const PackageCollapsePanel = ({ index, dataList, data, setData }: Props) => {
    const dispatch = useAppDispatch();
    const { storeCategoryOptionList } = useAppSelector((state) => state.storeDetail);

    const [storeList, setStoreList] = useState<ObjectOption[]>([]);
    const [goodsList, setGoodsList] = useState<GoodsListItem[]>([]);

    useEffect(() => {
        dispatch(getStoreCategory());
        dispatch(getGoodsType());
        if (data.store_category_idx !== 0) {
            getStoreList(data.store_category_idx);
        }
        if (data.store_idx !== 0) {
            getStoreGoodsList(data.store_idx);
        }
    }, []);

    const getStoreList = (storeCategoryIdx: number) => {
        const token = window.localStorage.getItem('utToken');
        api_common
            .get(`/store/list${toQueryString({ 'store-category-idx': storeCategoryIdx })}`, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + token },
            })
            .then((response) => {
                console.log('response', response);
                const data = response.data;
                if (data) {
                    setStoreList(
                        data.store_list.map((item: StoreListItem) => {
                            return { label: item.store_name, value: item.store_idx };
                        }),
                    );
                }
                return;
            })
            .catch((error) => {
                console.log('err', error);
                notification['warning']({
                    message: '스토어 목록 조회에 실패했습니다.',
                });
                return;
            });
    };

    const getStoreGoodsList = (storeIdx: number) => {
        const token = window.localStorage.getItem('utToken');
        api_common
            .get(`/store/${storeIdx}/goods/list${toQueryString({ 'package-goods-yn': 'Y' })}`, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + token },
            })
            .then((response) => {
                console.log('response', response);
                const data = response.data;
                if (data) {
                    setGoodsList(data);
                }
                return;
            })
            .catch((error) => {
                console.log('err', error);
                notification['warning']({
                    message: '스토어 목록 조회에 실패했습니다.',
                });
                return;
            });
    };

    const onChangeStoreCategory = useCallback(
        (index: number, option: any) => {
            let newData: (PackageGoodsItem & { package_idx?: number })[] = [];
            dataList.forEach((item, index) => {
                newData[index] = { ...item };
            });
            if (typeof option.value === 'number') {
                newData[index].store_category_idx = Number(option.value);
                newData[index].store_idx = 0;
                newData[index].store_name = '';
                getStoreList(option.value);
            }
            newData[index].store_category_name = option.label;
            setData(newData);
        },
        [index, dataList],
    );
    const onChangeStore = useCallback(
        (index: number, option: any) => {
            let newData: (PackageGoodsItem & { package_idx?: number })[] = [];
            dataList.forEach((item, index) => {
                newData[index] = { ...item };
            });
            if (typeof option.value === 'number') {
                newData[index].store_idx = option.value;
                newData[index].goods_idx = 0;
                newData[index].goods_name = '';
                newData[index].goods_type_idx = 0;
                newData[index].goods_type_name = '';
                newData[index].store_name = option.label;
                getStoreGoodsList(option.value);
            }
            setData(newData);
        },
        [dataList],
    );

    const onChangeGoods = useCallback(
        (index: number, option: any) => {
            let newData: (PackageGoodsItem & { package_idx?: number })[] = [];
            dataList.forEach((item, index) => {
                newData[index] = { ...item };
            });
            if (typeof option.value === 'number') {
                newData[index].goods_idx = option.value;
                newData[index].goods_name = option.label;
                newData[index].goods_type_idx =
                    goodsList.find((item) => item.goods_idx === option.value)?.goods_type_idx || 0;
                newData[index].goods_type_name =
                    goodsList.find((item) => item.goods_idx === option.value)?.goods_type_name || '';
            }
            setData(newData);
        },
        [dataList, goodsList],
    );

    return (
        <Row gutter={[16, 16]}>
            <Col span={3}>
                <Typography.Text type="secondary">카테고리</Typography.Text>
            </Col>
            <Col span={9}>
                <Select
                    value={{ label: data.store_category_name, value: data.store_category_idx }}
                    onChange={(e) => onChangeStoreCategory(index, e)}
                    labelInValue
                    style={{ width: '100%' }}>
                    {storeCategoryOptionList.map((item) => (
                        <Select.Option key={item.value} value={item.value}>
                            {item.label}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
            <Col span={12} />
            <Col span={3}>
                <Typography.Text type="secondary">스토어</Typography.Text>
            </Col>
            <Col span={9}>
                <Select
                    value={{ label: data.store_name, value: data.store_idx }}
                    onChange={(e) => onChangeStore(index, e)}
                    labelInValue
                    disabled={data.store_category_name === ''}
                    style={{ width: '100%' }}>
                    {storeList?.map((item) => (
                        <Select.Option key={item.value} value={item.value}>
                            {item.label}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
            <Col span={12} />
            <Col span={3}>
                <Typography.Text type="secondary">상품</Typography.Text>
            </Col>
            <Col span={9}>
                <Select
                    value={{ label: data.goods_name, value: data.goods_idx }}
                    onChange={(e, v) => onChangeGoods(index, e)}
                    labelInValue
                    disabled={data.store_name === ''}
                    style={{ width: '100%' }}>
                    {goodsList?.map((item) => (
                        <Select.Option key={item.goods_idx} value={item.goods_idx}>
                            {item.goods_name}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
        </Row>
    );
};

export default PackageCollapsePanel;
