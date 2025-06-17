import React from 'react';
import layoutSlice from '../../../store/slice/layout';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import { HeaderStyle, HeaderUserStyle, LogoStyle } from './style';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button } from 'antd';
import userSlice from '../../../store/slice/user';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { logout } from '../../../api/auth/auth';

const Header = () => {
    const { sidebarCollapse } = useAppSelector((state) => state.layout);
    const { user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLeftDrawerToggle = () => {
        dispatch(layoutSlice.actions.toggleSidebar(!sidebarCollapse));
    };

    const onLogout = () => {
        const uuid = window.localStorage.getItem('uuid');
        if (uuid) {
            dispatch(logout({ device_uuid: uuid }));
        }
        navigate('/login');
    };

    return (
        <HeaderStyle>
            <LogoStyle>
                <h1>현지투어닷컴</h1>
            </LogoStyle>
            <HeaderUserStyle>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <div className={`user-info`}>
                    <b>{user || 'Admin'}</b>
                </div>
                <div style={{ marginLeft: '1rem' }}>
                    <Button type="text" icon={<Logout style={{ color: '#bfbfbf' }} />} onClick={onLogout} />
                </div>
            </HeaderUserStyle>
        </HeaderStyle>
    );
};

export default Header;
