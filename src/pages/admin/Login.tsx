import React, { useCallback, useEffect } from 'react';
import useInput from '../../hooks/useInput';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import { login } from '../../api/auth/auth';
import { LoginRequest } from '../../api/auth/authType';
import { useNavigate } from 'react-router';
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Title from '../../components/container/Title';
import { v4 as uuid_v4 } from 'uuid';
import userSlice from '../../store/slice/user';

const Login = () => {
    const navigate = useNavigate();
    const { token, loginSuccess } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');

    useEffect(() => {
        dispatch(userSlice.actions.resetState());
        if (!window.localStorage.getItem('uuid')) {
            window.localStorage.setItem('uuid', uuid_v4());
        }
        console.log('dsdsdsd', window.localStorage.getItem('uuid'));
    }, []);
    useEffect(() => {
        if (loginSuccess) {
            navigate('/');
            dispatch(userSlice.actions.resetLoginState());
        }
    }, [loginSuccess]);
    const onSubmit = useCallback(
        async (e: any) => {
            // e.preventDefault();
            console.log('login', id, password);
            const data: LoginRequest = {
                manager_email: id,
                manager_password: password,
                login_device: {
                    device_uuid: window.localStorage.getItem('uuid') || '',
                    device_name: getUA(),
                    device_os: getUA(),
                    push_token: '',
                },
            };
            dispatch(userSlice.actions.setUuid(''));
            await dispatch(login(data));
            //navigate('/');
        },
        [id, password],
    );
    const getUA = () => {
        let device = 'Unknown';
        const ua = {
            'Generic Linux': /Linux/i,
            Android: /Android/i,
            BlackBerry: /BlackBerry/i,
            Bluebird: /EF500/i,
            'Chrome OS': /CrOS/i,
            Datalogic: /DL-AXIS/i,
            Honeywell: /CT50/i,
            iPad: /iPad/i,
            iPhone: /iPhone/i,
            iPod: /iPod/i,
            macOS: /Macintosh/i,
            Windows: /IEMobile|Windows/i,
            Zebra: /TC70|TC55/i,
        };
        // @ts-ignore
        Object.keys(ua).map((v) => navigator.userAgent.match(ua[v]) && (device = v));
        return device;
    };

    return (
        <Row justify={'center'} align={'middle'} style={{ height: '100vh' }}>
            <Col md={8} sm={24}>
                <Title title="현지투어 CMS" />
                <Form
                    className="login-form"
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    initialValues={{ remember: true }}
                    onFinish={onSubmit}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off">
                    <Form.Item name="id" rules={[{ required: true, message: 'ID를 입력해 주세요.' }]}>
                        <Input
                            size={'large'}
                            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="ID"
                            value={id}
                            onChange={onChangeId}
                        />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: '비밀번호를 입력해 주세요.' }]}>
                        <Input.Password
                            size={'large'}
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Password"
                            value={password}
                            onChange={onChangePassword}
                        />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        {/*<Checkbox>착한 사람임</Checkbox>*/}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            LOGIN
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default Login;
