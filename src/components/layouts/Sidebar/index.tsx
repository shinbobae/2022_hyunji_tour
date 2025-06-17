import React from 'react';
import { MenuItemStyle, SideBarStyle } from './style';
import { NavLink } from 'react-router-dom';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined';
import PinDropIcon from '@mui/icons-material/PinDrop';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import { useAppSelector } from '../../../hooks/useToolkit';

const menuList = [
    { title: 'dashboard', link: '', icon: <WidgetsOutlinedIcon /> },
    { title: 'bus', link: 'bus', icon: <DirectionsBusFilledOutlinedIcon /> },
    { title: 'bus stop', link: 'bus-stop', icon: <PinDropIcon /> },
    { title: 'route', link: 'route', icon: <VpnKeyOutlinedIcon /> },
    { title: 'store', link: 'store', icon: <ExtensionOutlinedIcon /> },
    { title: 'order', link: 'order', icon: <ReceiptOutlinedIcon /> },
    { title: 'user', link: 'user', icon: <PersonOutlineOutlinedIcon /> },
    { title: 'package', link: 'package', icon: <Inventory2OutlinedIcon /> },
    { title: 'city', link: 'city', icon: <LocationCityOutlinedIcon /> },
    { title: 'event', link: 'event', icon: <EventAvailableOutlinedIcon /> },
    { title: 'booking', link: 'booking', icon: <ConfirmationNumberOutlinedIcon /> },
    // { title: 'ticket', link: 'ticket', icon: <ConfirmationNumberOutlinedIcon /> },
    { title: 'setting', link: 'setting', icon: <SettingsOutlinedIcon /> },
];

const Sidebar = () => {
    const { sidebarCollapse } = useAppSelector((state) => state.layout);
    return (
        <SideBarStyle collapse={sidebarCollapse}>
            {menuList.map((item) => (
                <MenuItemStyle key={item.title}>
                    <NavLink to={`/${item.link}`} className={({ isActive }) => (isActive ? 'active link' : 'link')}>
                        {item.icon}
                        <span>{item.title}</span>
                        <ArrowRightOutlinedIcon className="arrow" fontSize="small" />
                    </NavLink>
                </MenuItemStyle>
            ))}
        </SideBarStyle>
    );
};
export default Sidebar;
