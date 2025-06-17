import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../../components/layouts/AppLayout';
import Title from '../../../components/container/Title';
import { Row, Col, Input, Typography, Select, Button, Modal, Radio, notification } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import { editManager, getManager, getManagerRoleList, saveManager } from '../../../api/contents/manage/manage';
import { Link } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useInput from '../../../hooks/useInput';
import useInputValue from '../../../hooks/useInputValue';
import { useParams } from 'react-router';
import adminSettingSlice from '../../../store/slice/adminSetting/adminSetting';
import { getStoreList } from '../../../api/contents/store/store';
import { ManageEditRequest, ManageSaveRequest } from '../../../api/contents/manage/manageType';
import busSlice from '../../../store/slice/bus/bus';
import { ObjectOption } from '../../../api/type';

const SettingDetail = () => {
    let { id } = useParams();
    const dispatch = useAppDispatch();
    const { roleList, detailData, saveSuccess, saveFailure } = useAppSelector((state) => state.adminSetting);
    const { storeOptionList } = useAppSelector((state) => state.store);

    const [saveLoading, setSaveLoading] = useState(false);
    const [name, onChangeName, setName] = useInput('');
    const [email, onChangeEmail, setEmail] = useInput('');
    const [password, onChangePassword, setPassword] = useInput('');
    const [passwordConfirm, onChangePasswordConfirm, setPasswordConfirm] = useInput('');
    const [tel, onChangeTel, setTel] = useInput('');
    const [account, onChangeAccount, setAccount] = useInputValue(0);
    const [suspendYn, onChangeSuspendYn, setSuspendYn] = useInput('N');
    const [store, onChangeStore, setStore] = useInputValue(0);

    const [accountStoreOptionList, setAccountStoreOptionList] = useState<ObjectOption[]>([]);

    useEffect(() => {
        dispatch(adminSettingSlice.actions.resetState());
        dispatch(getManagerRoleList());
        dispatch(getStoreList({}));
    }, []);

    useEffect(() => {
        if (id) dispatch(getManager(Number(id)));
    }, [id]);
    useEffect(() => {
        if (detailData) {
            setName(detailData.manager_name);
            setEmail(detailData.manager_email);
            setTel(detailData.manager_phone);
            setAccount(detailData.manager_role_idx);
            setSuspendYn(detailData.suspend_yn);
            setStore(detailData.store_idx);
        }
    }, [detailData]);

    useEffect(() => {
        const newOptionList = storeOptionList.filter((item) => {
            if (account === 1) {
                return item;
            } else if (account === 2) {
                //스토어 관리자
                return item.value !== 1;
            } else if (account === 3) {
                //버스 관리자
                return item.value === 1;
            }
        });
        setAccountStoreOptionList(newOptionList);
    }, [account, storeOptionList]);

    const onSave = useCallback(() => {
        if (name === '') {
            notification['warning']({
                message: '관리자명을 입력해 주세요.',
            });
            return;
        }
        if (email === '') {
            notification['warning']({
                message: '아이디로 사용될 이메일을 입력해 주세요.',
            });
            return;
        }
        if (password === '') {
            notification['warning']({
                message: '비밀번호를 입력해 주세요.',
            });
            return;
        }
        if (tel === '') {
            notification['warning']({
                message: '연락처를 입력해 주세요.',
            });
            return;
        }
        if (account === 0) {
            notification['warning']({
                message: '관리 권한을 선택해 주세요.',
            });
            return;
        }
        if (store === 0) {
            notification['warning']({
                message: '관리 스토어를 선택해 주세요.',
            });
            return;
        }
        setSaveLoading(true);
        if (id) {
            const data: ManageEditRequest = {
                manager_idx: Number(id),
                manager_password: password,
                manager_name: name,
                manager_phone: tel,
                suspend_yn: suspendYn,
                manager_role_idx: account,
                store_idx: store,
            };
            dispatch(editManager(data));
        } else {
            const data: ManageSaveRequest = {
                manager_email: email,
                manager_password: password,
                manager_name: name,
                manager_phone: tel,
                manager_role_idx: account,
                store_idx: store,
            };
            dispatch(saveManager(data));
        }
    }, [id, name, email, password, passwordConfirm, tel, account, suspendYn, store]);

    useEffect(() => {
        if (saveSuccess) {
            setSaveLoading(false);
            notification['success']({
                message: '저장되었습니다.',
            });
            dispatch(adminSettingSlice.actions.resetState());
        }
        if (saveFailure) {
            setSaveLoading(false);
            notification['warning']({
                message: '저장에 실패했습니다.',
            });
        }
    }, [saveSuccess, saveFailure]);

    return (
        <AppLayout>
            <Title title={`Setting`} />
            <Typography.Title level={5}>관리자 계정 설정</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Typography.Text type="secondary">관리자명</Typography.Text>
                    <Input value={name} onChange={onChangeName} placeholder="관리자명" />
                </Col>
                <Col span={6}>
                    {id && (
                        <>
                            <Typography.Text type="secondary">계정 유예 여부</Typography.Text>
                            <Radio.Group value={suspendYn} onChange={onChangeSuspendYn} style={{ width: '100%' }}>
                                <Radio.Button value={'Y'}>유예</Radio.Button>
                                <Radio.Button value={'N'}>활성화</Radio.Button>
                            </Radio.Group>
                        </>
                    )}
                </Col>
                <Col span={12} />
                <Col span={12}>
                    <Typography.Text type="secondary">이메일 아이디</Typography.Text>
                    <Input
                        value={email}
                        disabled={id !== undefined}
                        onChange={onChangeEmail}
                        placeholder="이메일 아이디"
                    />
                </Col>
                <Col span={12} />
                <Col span={6}>
                    <Typography.Text type="secondary">비밀번호</Typography.Text>
                    <Input.Password value={password} onChange={onChangePassword} placeholder="비밀번호" />
                </Col>
                {/*
                <Col span={6}>
                    <Typography.Text type="secondary">비밀번호 확인</Typography.Text>
                    <Input.Password
                        value={passwordConfirm}
                        onChange={onChangePasswordConfirm}
                        placeholder="비밀번호 확인"
                    />
                </Col>
                */}
                <Col span={18} />
                <Col span={6}>
                    <Typography.Text type="secondary">연락처</Typography.Text>
                    <Input value={tel} onChange={onChangeTel} placeholder="000-0000-0000" />
                </Col>
                <Col span={18} />
                <Col span={6}>
                    <Typography.Text type="secondary">권한</Typography.Text>
                    {account !== 1 ? (
                        <Select
                            value={account}
                            onChange={onChangeAccount}
                            style={{ width: '100%' }}
                            placeholder={`옵션을 선택해 주세요.`}>
                            <Select.Option value={0} disabled>
                                권한 선택
                            </Select.Option>
                            {roleList.map((option) => (
                                <Select.Option key={`role${option.value}`} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    ) : (
                        <p>최고관리자</p>
                    )}
                </Col>
                <Col span={6}>
                    <Typography.Text type="secondary">관리 스토어</Typography.Text>
                    {/*<Input value={store} onChange={onChangeStore} placeholder="??" />*/}
                    <Select
                        value={store}
                        onChange={onChangeStore}
                        style={{ width: '100%' }}
                        placeholder={`옵션을 선택해 주세요.`}>
                        <Select.Option value={0} disabled>
                            스토어 선택
                        </Select.Option>
                        {accountStoreOptionList.map((option) => (
                            <Select.Option key={`store${option.value}`} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col span={24} style={{ marginTop: '1rem', paddingBottom: '4rem', textAlign: 'right' }}>
                    <Link to={`/setting`}>
                        <Button size={'large'} style={{ marginRight: '0.5rem' }}>
                            Back
                        </Button>
                    </Link>
                    <Button size={'large'} type="primary" loading={saveLoading} onClick={onSave}>
                        Save
                    </Button>
                </Col>
            </Row>
        </AppLayout>
    );
};
export default SettingDetail;
