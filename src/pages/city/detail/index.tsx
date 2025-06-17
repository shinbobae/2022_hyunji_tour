import React, { useCallback, useEffect, useState } from 'react';
import { Col, Input, Modal, notification, Radio, Row, Select, Typography } from 'antd';
import citySlice, { CityDataType } from '../../../store/slice/cirty/city';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import useInputValue from '../../../hooks/useInputValue';
import { ObjectOption } from '../../../api/type';
import useInput from '../../../hooks/useInput';
import countrySlice from '../../../store/slice/country/country';
import { getCountryList } from '../../../api/contents/country/country';
import { AddCityRequest, EditCityRequest } from '../../../api/contents/city/cityType';
import { saveCity } from '../../../api/contents/city/city';

interface Props {
    mode: string;
    data: CityDataType | null;
    setModal: React.Dispatch<React.SetStateAction<{ mode: string; data: CityDataType | null }>>;
}
const CityDetailModal = ({ mode, data, setModal }: Props) => {
    const dispatch = useAppDispatch();
    const { countryOptionList } = useAppSelector((state) => state.country);
    const { saveLoading, saveSuccess, saveFailure } = useAppSelector((state) => state.city);

    const [cityIdx, setCityIdx] = useState<number | null>(null);
    const [country, onChangeCountry, setCountry] = useInputValue<ObjectOption | null>(null);
    const [cityName, onChangeCityName, setCityName] = useInput('');
    const [serviceYn, onChangeServiceYn, setServiceYn] = useInput('N');

    useEffect(() => {
        dispatch(countrySlice.actions.resetState());
        dispatch(getCountryList());
    }, []);
    useEffect(() => {
        if (data) {
            setCityIdx(data.cityIdx);
            setCountry({ value: data.countryIdx, label: data.countryName });
            setCityName(data.cityName);
            setServiceYn(data.serviceYn);
        } else {
            initState();
        }
    }, [data]);

    const onSave = useCallback(() => {
        if (country === null) {
            notification['warning']({ message: '국가를 선택해 주세요.' });
            return;
        }
        if (cityName.trim() === '') {
            notification['warning']({ message: '도시명을 입력해 주세요.' });
            return;
        }

        if (cityIdx === null) {
            const data: AddCityRequest = {
                country_idx: Number(country.value),
                country_name: country.label,
                city_name: cityName,
                service_yn: serviceYn,
            };
            dispatch(saveCity(data));
        } else {
            const data: EditCityRequest = {
                country_idx: Number(country.value),
                country_name: country.label,
                city_idx: cityIdx,
                city_name: cityName,
                service_yn: serviceYn,
            };
            dispatch(saveCity(data));
        }
    }, [mode, cityIdx, country, cityName, serviceYn]);

    const onClose = useCallback(() => {
        setModal({ mode: '', data: null });
        initState();
    }, [mode, data]);

    const initState = () => {
        setCityIdx(null);
        setCountry(null);
        setCityName('');
        setServiceYn('N');
    };

    useEffect(() => {
        if (saveSuccess) {
            notification['success']({
                message: '저장되었습니다.',
            });
            initState();
        }
        if (saveFailure) {
            notification['warning']({
                message: '저장에 실패했습니다.',
            });
        }
        dispatch(citySlice.actions.changeInitState());
    }, [saveSuccess, saveFailure]);

    return (
        <Modal
            title="도시 정보 입력"
            visible={mode !== ''}
            onOk={onSave}
            onCancel={onClose}
            width={600}
            confirmLoading={saveLoading}>
            {cityIdx && (
                <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
                    <Col span={4}>
                        <Typography.Text>도시 Idx</Typography.Text>
                    </Col>
                    <Col span={5}>
                        <Input value={cityIdx || ''} disabled />
                    </Col>
                </Row>
            )}
            <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
                <Col span={4}>
                    <Typography.Text>국가선택</Typography.Text>
                </Col>
                <Col span={20}>
                    <Select
                        placeholder={`국가를 선택해 주세요.`}
                        style={{ width: '100%' }}
                        labelInValue
                        value={country}
                        onChange={onChangeCountry}>
                        {countryOptionList?.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col span={4}>
                    <Typography.Text>도시명</Typography.Text>
                </Col>
                <Col span={20}>
                    <Input value={cityName} onChange={onChangeCityName} />
                </Col>
                <Col span={4}>
                    <Typography.Text>서비스 여부</Typography.Text>
                </Col>
                <Col span={20}>
                    <Radio.Group onChange={onChangeServiceYn} value={serviceYn}>
                        <Radio.Button value={'Y'}>운영</Radio.Button>
                        <Radio.Button value={'N'}>미운영</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
        </Modal>
    );
};

export default CityDetailModal;
