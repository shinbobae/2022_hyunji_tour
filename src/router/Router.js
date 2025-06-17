import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/admin/Login';
import Admin from '../pages/admin/Admin';
import Dashboard from '../pages/dashboard';
import RouteSetting from '../pages/route';
import Booking from '../pages/booking';
import Store from '../pages/store';
import User from '../pages/user';
import Setting from '../pages/setting';
import SettingDetail from '../pages/setting/detail';
import RouteDetail from '../pages/route/detail';
import BusStopSetting from '../pages/busStop';
import StoreDetail from '../pages/store/detail';
import BusSetting from '../pages/bus';
import UserDetail from '../pages/user/detail';
import Package from '../pages/package';
import Order from '../pages/order';
import PackageDetail from '../pages/package/detail';
import City from '../pages/city';
import Event from '../pages/event';
import EventDetail from '../pages/event/detail';
import Ticket from '../pages/ticket';
import BookingDetail from '../pages/booking/detail';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />

            {/*<Route path="/" element={<Navigate replace to={`/did/1`} />} />*/}
            {/*<Route path="/did/:area" element={<Home />} />*/}
            <Route path="/" element={<Dashboard />} />
            <Route path="/bus" element={<BusSetting />} />
            <Route path="/bus-stop" element={<BusStopSetting />} />
            <Route path="/route" element={<RouteSetting />} />
            <Route path="/route/:id" element={<RouteDetail />} />
            <Route path="/route/create" element={<RouteDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/:id" element={<BookingDetail />} />
            <Route path="/booking/create" element={<BookingDetail />} />
            <Route path="/store" element={<Store />} />
            <Route path="/store/:id" element={<StoreDetail />} />
            <Route path="/store/create" element={<StoreDetail />} />
            <Route path="/user" element={<User />} />
            {/*<Route path="/user/create" element={<UserDetail />} />*/}
            {/*<Route path="/user/:id" element={<UserDetail />} />*/}
            <Route path="/order" element={<Order />} />
            <Route path="/package" element={<Package />} />
            <Route path="/package/create" element={<PackageDetail />} />
            <Route path="/package/:id" element={<PackageDetail />} />
            <Route path="/city" element={<City />} />
            <Route path="/event" element={<Event />} />
            <Route path="/event/create" element={<EventDetail />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/setting/:id" element={<SettingDetail />} />
            <Route path="/setting/create" element={<SettingDetail />} />
        </Routes>
    );
};

export default AppRouter;
