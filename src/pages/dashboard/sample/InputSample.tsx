import React, { useCallback } from 'react';
import { Col, Input, Row, Typography } from 'antd';
import useInput from '../../../hooks/useInput';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const InputSample = () => {
    const [text, onChangeText] = useInput('');
    const onSearch = useCallback(() => {
        console.log('search', text);
    }, [text]);

    return (
        <>
            <Typography.Title level={5}>text input</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col md={12}>
                    <Input value={text} onChange={onChangeText} placeholder="input value" />
                </Col>
                <Col md={12}>
                    <Input.Group compact>
                        <Input.Search value={text} onChange={onChangeText} onSearch={onSearch} />
                    </Input.Group>
                </Col>
                <Col md={12}>
                    <Input.TextArea
                        value={text}
                        onChange={onChangeText}
                        rows={4}
                        placeholder="textAreaaaaaa"
                        maxLength={6}
                    />
                </Col>
                <Col md={6}>
                    <Input.Password value={text} onChange={onChangeText} placeholder="input password" />
                    <Input.Password
                        value={text}
                        onChange={onChangeText}
                        status={`error`}
                        placeholder="input password"
                    />
                </Col>
                <Col md={6}>
                    <Input value={text} onChange={onChangeText} prefix="**" suffix="원" />
                </Col>
            </Row>
        </>
    );
};

export default InputSample;
