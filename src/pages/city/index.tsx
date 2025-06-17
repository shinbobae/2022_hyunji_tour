import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../components/layouts/AppLayout';
import Title from '../../components/container/Title';
import { Button, Col, notification, Row, Select, Table, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import useInputValue from '../../hooks/useInputValue';
import { CityListRequest } from '../../api/contents/city/cityType';
import { getCountryList } from '../../api/contents/country/country';
import countrySlice from '../../store/slice/country/country';
import { ObjectOption } from '../../api/type';
import citySlice, { CityDataType } from '../../store/slice/cirty/city';
import { TablePaginationConfig } from 'antd/es/table/interface';
import { getCityList } from '../../api/contents/city/city';
import CityDetailModal from './detail';

const City = () => {
    const dispatch = useAppDispatch();
    const { countryOptionList } = useAppSelector((state) => state.country);
    const { column, tableData, total, listLoading, listFailure, saveSuccess } = useAppSelector((state) => state.city);

    const [searchCountry, onChangeSearchCountry, setSearchCountry] = useInputValue<ObjectOption | null>(null);
    const [searchParam, setSearchParam] = useState<CityListRequest>({ page: 1, limit: 10 });
    const [detailModal, setDetailModal] = useState<{ mode: string; data: CityDataType | null }>({
        mode: '',
        data: null,
    });

    useEffect(() => {
        dispatch(countrySlice.actions.resetState());
        dispatch(citySlice.actions.resetState());
        dispatch(getCountryList());
        dispatch(getCityList(searchParam));
    }, []);

    useEffect(() => {
        dispatch(getCityList(searchParam));
    }, [searchParam]);
    const onSearch = useCallback(() => {
        let param: CityListRequest = { page: 1, limit: 10 };
        if (searchCountry) {
            param['country-name'] = searchCountry.label;
        }
        setSearchParam(param);
    }, [searchCountry, searchParam]);

    const onChangePage = useCallback(
        (pagination: TablePaginationConfig) => {
            setSearchParam({ ...searchParam, page: pagination.current, limit: pagination.pageSize });
        },
        [searchParam],
    );

    useEffect(() => {
        if (listFailure) {
            notification['warning']({
                message: '목록 조회에 실패했습니다.',
            });
        }
        if (saveSuccess) {
            setDetailModal({ mode: '', data: null });
            dispatch(getCityList(searchParam));
        }
        dispatch(citySlice.actions.changeInitState());
    }, [searchParam, listFailure, saveSuccess]);
    return (
        <AppLayout>
            <Title title={`City`} subTitle={`도시 관리`} />
            <Row gutter={[8, 8]} justify={'space-between'} style={{ marginBottom: '0.5rem' }}>
                <Col md={6}>
                    <Select
                        size={'large'}
                        style={{ width: '100%' }}
                        placeholder={`국가를 선택해 주세요.`}
                        labelInValue
                        allowClear
                        value={searchCountry}
                        onChange={onChangeSearchCountry}>
                        {countryOptionList?.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col md={12}>
                    <Button size="large" type={'primary'} onClick={onSearch}>
                        검색
                    </Button>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                    <Button
                        size="large"
                        type={'primary'}
                        onClick={() => setDetailModal({ mode: 'create', data: null })}
                        style={{ marginLeft: '0.5rem' }}>
                        도시 추가
                    </Button>
                </Col>
            </Row>
            <Table
                rowKey={(item: CityDataType) => item.cityIdx}
                dataSource={tableData}
                loading={listLoading}
                // rowSelection={{ selectedRowKeys: selectedRow, onChange: onSelectRow }}
                pagination={{ current: searchParam.page, pageSize: searchParam.limit, total: total }}
                onChange={onChangePage}
                footer={() => `total ${total}`}>
                {column.map((col) => {
                    if (col.key === 'cityName') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                key={col.key}
                                render={(_: any, record) => (
                                    <Button
                                        type={`link`}
                                        onClick={() => setDetailModal({ mode: 'detail', data: record })}>
                                        [{record.cityIdx}] {_}
                                    </Button>
                                )}
                            />
                        );
                    }
                    if (col.key === 'serviceYn') {
                        return (
                            <Table.Column
                                title={col.title}
                                dataIndex={col.key}
                                align={col.align}
                                key={col.key}
                                render={(_: any) => (
                                    <Typography.Text type={_ === 'N' ? 'danger' : 'success'}>
                                        {_ === 'N' ? '미운영' : '운영'}
                                    </Typography.Text>
                                )}
                            />
                        );
                    }
                    return <Table.Column align={'center'} title={col.title} dataIndex={col.key} key={col.key} />;
                })}
            </Table>
            {detailModal.mode !== '' && (
                <CityDetailModal mode={detailModal.mode} data={detailModal.data} setModal={setDetailModal} />
            )}
        </AppLayout>
    );
};

export default City;
