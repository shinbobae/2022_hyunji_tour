import React from 'react';
import { Col, Radio, Row, Typography } from 'antd';
import useInput from 'hooks/useInput';

const RadioSample = () => {
    const [radioValue, onChangeRadioValue] = useInput(1);

    return (
        <>
            <Typography.Title level={5}>radio</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col md={6}>
                    <Radio.Group onChange={onChangeRadioValue} value={radioValue}>
                        <Radio value={1}>A</Radio>
                        <Radio value={2}>B</Radio>
                        <Radio value={3}>C</Radio>
                        <Radio value={4} disabled={true}>
                            D
                        </Radio>
                    </Radio.Group>
                </Col>
                <Col md={6}>
                    <Radio.Group onChange={onChangeRadioValue} value={radioValue}>
                        <Radio.Button value={1}>A</Radio.Button>
                        <Radio.Button value={2}>B</Radio.Button>
                        <Radio.Button value={3}>C</Radio.Button>
                        <Radio.Button value={4} disabled={true}>
                            D
                        </Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
        </>
    );
};

export default RadioSample;
