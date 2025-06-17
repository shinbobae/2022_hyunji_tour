import React, { useState } from 'react';
import { Col, Row, Typography, Select } from 'antd';
import { ObjectOption } from '../../../api/type';

const sampleOptionList: ObjectOption[] = [
    { value: 1, label: '이것은 치킨인가 갈비인가' },
    { value: 2, label: '언더테일 아시는구나!' },
];

const SelectSample = () => {
    const [stringSelect, setStringSelect] = useState<string | number>(1);
    const [objectSelect, setObjectSelect] = useState<ObjectOption>();

    const onChangeStringSelect = (value: string | number) => {
        setStringSelect(value);
    };
    const onChangeObjectSelect = (value: ObjectOption) => {
        setObjectSelect(value);
    };
    return (
        <>
            <Typography.Title level={5}>select</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col md={8}>
                    <Select value={stringSelect} onChange={onChangeStringSelect}>
                        {sampleOptionList.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                        <Select.Option value="disabled" disabled>
                            Disabled
                        </Select.Option>
                    </Select>
                    <p>{stringSelect}</p>
                </Col>
                <Col md={8}>
                    <Select
                        // defaultValue={sampleOptionList[1]}
                        placeholder={`옵션을 선택해 주세요.`}
                        labelInValue
                        value={objectSelect}
                        onChange={onChangeObjectSelect}>
                        {sampleOptionList.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                    <p>{JSON.stringify(objectSelect)}</p>
                </Col>
            </Row>
        </>
    );
};
export default SelectSample;
