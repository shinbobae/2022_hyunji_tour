import React, { useEffect, useState } from 'react';
import { Card, Avatar, Col, Row, Typography } from 'antd';
const CardSample = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <>
            <Typography.Title level={5}>card</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col md={8}>
                    <Card loading={loading} bordered={false}>
                        <Card.Meta title="Card title" description="This is the description" />
                    </Card>
                </Col>
                <Col md={8}>
                    <Card loading={loading}>
                        <Card.Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title="Card title"
                            description="This is the description"
                        />
                    </Card>
                </Col>
                <Col md={8}>
                    <Card loading={loading} title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default CardSample;
