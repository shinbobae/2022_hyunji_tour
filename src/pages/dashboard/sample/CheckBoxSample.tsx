import React, { useCallback, useEffect, useState } from 'react';
import { Col, Checkbox, Row, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxButton } from 'assets/style/CheckboxButton';

const CheckboxSample = () => {
    const [boolValue, setBoolValue] = useState<boolean>(true);
    const [checkValue, setCheckValue] = useState<CheckboxValueType[]>([2]);
    const [arrayValue, setArrayValue] = useState<string>('0100');

    const onChangeCheckValue = useCallback(
        (e: CheckboxValueType[]) => {
            setCheckValue(e);
        },
        [boolValue],
    );
    const onChangeArrayValue = useCallback(
        (e: CheckboxChangeEvent, index: number) => {
            const newArray = arrayValue.split('');
            if (e.target.checked) {
                newArray[index] = '1';
            } else {
                newArray[index] = '0';
            }
            setArrayValue(newArray.join(''));
        },
        [arrayValue],
    );

    return (
        <>
            <Typography.Title level={5}>checkbox</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col md={6}>
                    <Checkbox checked={boolValue} onChange={(e: CheckboxChangeEvent) => setBoolValue(e.target.checked)}>
                        {boolValue.toString()}
                    </Checkbox>
                </Col>
                <Col md={6}>
                    <Checkbox.Group value={checkValue} onChange={onChangeCheckValue}>
                        <Checkbox value={1}>1</Checkbox>
                        <Checkbox value={2}>2</Checkbox>
                        <Checkbox value={3}>3</Checkbox>
                        {checkValue.toString()}
                    </Checkbox.Group>
                </Col>
                <Col md={6}>
                    {arrayValue.split('').map((item, index) => (
                        <Checkbox
                            key={`chk${index}`}
                            checked={arrayValue[index] === '1'}
                            onChange={(e) => onChangeArrayValue(e, index)}>
                            {index + 1}
                        </Checkbox>
                    ))}
                    {arrayValue}
                </Col>

                <Col md={6}>
                    {arrayValue.split('').map((item, index) => (
                        <CheckboxButton
                            key={`chk${index}`}
                            checked={arrayValue[index] === '1'}
                            onChange={(e) => onChangeArrayValue(e, index)}>
                            요일{index + 1}
                        </CheckboxButton>
                    ))}
                    {arrayValue}
                </Col>
            </Row>
        </>
    );
};

export default CheckboxSample;
