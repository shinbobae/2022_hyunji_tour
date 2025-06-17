import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../../components/layouts/AppLayout';
import Title from '../../../components/container/Title';
import { Button, Col, Input, notification, Radio, Row, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import { UserSettingDataType } from '../../../store/slice/userSetting/userSetting';
import useInput from '../../../hooks/useInput';
import { WarningOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { EditUserRequest, SaveUserRequest } from '../../../api/contents/user/userType';
import { editUser, saveUser } from '../../../api/contents/user/user';

const UserDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { saveLoading, saveSuccess, saveFailure } = useAppSelector((state) => state.userSetting);

    const [idx, setIdx] = useState<number | null>(null);
    const [email, onChangeEmail, setEmail] = useInput('');
    const [password, onChangePassword, setPassword] = useInput('');
    const [passwordConfirm, onChangePasswordConfirm, setPasswordConfirm] = useInput('');
    const [name, onChangeName, setName] = useInput('');
    const [phone, onChangePhone, setPhone] = useInput('');
    const [delYn, onChangeDelYn, setDelYn] = useInput('N');

    useEffect(() => {
        const data: UserSettingDataType = location.state as UserSettingDataType;
        if (data) {
            setIdx(data.userIdx);
            setEmail(data.userEmail);
            setName(data.userName);
            setPhone(data.userTel);
            setDelYn(data.userStatus);
        }
    }, [location]);

    const emailValidation = useCallback(
        (email: string) => {
            const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

            return emailRegex.test(email);
        },
        [email],
    );

    const passwordValidation = useCallback(
        (password: string) => {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*.d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$/;

            return passwordRegex.test(password);
        },
        [password],
    );

    const onSave = useCallback(() => {
        if (email.trim() === '') {
            notification['warning']({
                message: '이메일 아이디를 입력해 주세요.',
            });
            return;
        }
        if (name.trim() === '') {
            notification['warning']({
                message: '이름을 입력해 주세요.',
            });
            return;
        }
        if (password !== passwordConfirm) {
            notification['warning']({
                message: '비밀번호를 확인해 주세요.',
            });
            return;
        }

        if (idx !== null) {
            const data: EditUserRequest = {
                user_idx: idx,
                user_name: name,
                user_password: password,
                user_phone: phone,
            };
            dispatch(editUser(data));
        } else {
            const data: SaveUserRequest = {
                user_email: email,
                user_name: name,
                user_password: password,
                user_phone: phone,
            };
            dispatch(saveUser(data));
        }
    }, [idx, email, password, passwordConfirm, name, phone, delYn]);

    useEffect(() => {
        if (saveSuccess) {
            notification['success']({
                message: '저장되었습니다.',
            });
            navigate('/user');
        }
        if (saveFailure) {
            notification['warning']({
                message: '저장에 실패했습니다.',
            });
        }
    }, [saveSuccess, saveFailure]);

    return (
        <AppLayout>
            <Title title={`User`} subTitle={`사용자 관리`} />
            <Typography.Title level={5}>User {location.state ? 'Edit' : 'Create'}</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Typography.Text type="secondary">이메일 ID</Typography.Text>
                    <Input
                        disabled={idx !== null}
                        value={email}
                        onChange={onChangeEmail}
                        placeholder="uptour@uptore.com"
                    />
                    {email.length > 0 && !emailValidation(email) && (
                        <Typography.Text type="danger" style={{ fontSize: '0.8rem' }}>
                            <WarningOutlined />
                            &nbsp;이메일 형식이 맞는지 확인해 주세요.
                        </Typography.Text>
                    )}
                </Col>
                <Col span={16} />
                {/*{idx ? (
                    <>
                        <Col span={8}>
                            <Typography.Text type="secondary">계정 활성화</Typography.Text>
                            <div>
                                <Radio.Group onChange={onChangeDelYn} value={delYn}>
                                    <Radio.Button value={'N'}>활성화 (사용)</Radio.Button>
                                    <Radio.Button value={'Y'}>비활성화 (탈퇴)</Radio.Button>
                                </Radio.Group>
                            </div>
                        </Col>
                        <Col span={8} />
                    </>
                ) : (
                    <Col span={16} />
                )}*/}
                <Col span={4}>
                    <Typography.Text type="secondary">이름</Typography.Text>
                    <Input value={name} onChange={onChangeName} placeholder="name" />
                </Col>
                <Col span={8}>
                    <Typography.Text type="secondary">연락처</Typography.Text>
                    <Input value={phone} onChange={onChangePhone} placeholder="000-0000-0000" />
                </Col>
                <Col span={12} />
                <Col span={6}>
                    <Typography.Text type="secondary">
                        비밀번호
                        <span style={{ fontSize: '0.8rem' }}>영문, 숫자, 특수문자 1개를 포함한 8자 이상의 문자</span>
                    </Typography.Text>
                    <Input.Password value={password} onChange={onChangePassword} placeholder="password" />
                    {password.length > 1 && !passwordValidation(password) && (
                        <Typography.Text type="danger" style={{ fontSize: '0.8rem' }}>
                            <WarningOutlined />
                            &nbsp;비밀번호 형식이 맞는지 확인해 주세요.
                        </Typography.Text>
                    )}
                </Col>
                <Col span={6}>
                    <Typography.Text type="secondary">비밀번호 확인</Typography.Text>
                    <Input.Password
                        value={passwordConfirm}
                        onChange={onChangePasswordConfirm}
                        placeholder="password confirm"
                    />
                    {passwordConfirm.length > 1 && password !== passwordConfirm && (
                        <Typography.Text type="danger" style={{ fontSize: '0.8rem' }}>
                            <WarningOutlined />
                            &nbsp;비밀번호를 확인해 주세요.
                        </Typography.Text>
                    )}
                </Col>
                <Col span={12} />
            </Row>
            <Row justify={'end'} style={{ marginTop: '2rem' }}>
                <Link to={'/user'}>
                    <Button size={'large'} style={{ marginRight: '0.5rem' }}>
                        Back
                    </Button>
                </Link>

                <Button size={'large'} type={'primary'} onClick={onSave} loading={saveLoading}>
                    Save
                </Button>
            </Row>
        </AppLayout>
    );
};

export default UserDetail;
