import React, { useEffect } from 'react';
import { Layout, notification } from 'antd';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import { useNavigate } from 'react-router';
import userSlice from '../../../store/slice/user';

const { Content } = Layout;

interface Props {
    children?: React.ReactNode;
}

const AppLayout = ({ children }: Props) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector((state) => state.user);
    const { sidebarCollapse } = useAppSelector((state) => state.layout);
    useEffect(() => {
        //dispatch(userSlice.actions.resetState());
    }, []);
    useEffect(() => {
        if (!window.localStorage.getItem('utToken')) {
            notification['warning']({
                message: '로그아웃 되었습니다.',
            });
            navigate('/login');
        }
    }, []);

    return (
        <Layout className="layout" style={{ height: '100%', minHeight: '100vh', backgroundColor: '#FCFCFC' }}>
            <Header />
            <Layout>
                <Sidebar />
                <Content style={{ paddingTop: '60px', paddingLeft: sidebarCollapse ? 0 : '252px' }}>
                    <div style={{ padding: '0 1rem 1rem ' }}>{children}</div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
