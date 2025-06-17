import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './slice/user';
import busStopSlice from './slice/busStop/busStop';
import routeSlice from './slice/route/route';
import layoutSlice from './slice/layout';
import routeDetailSlice from './slice/route/detail';
import bookingSlice from './slice/booking/booking';
import storeSlice from './slice/store/store';
import storeDetailSlice from './slice/store/detail';
import storeReservationSlice from './slice/store/reservation';
import userSettingSlice from './slice/userSetting/userSetting';
import adminSettingSlice from './slice/adminSetting/adminSetting';
import busSlice from './slice/bus/bus';
import commissionSlice from './slice/commission/commission';
import packageSlice from './slice/package/package';
import orderSlice from './slice/order/order';
import citySlice from './slice/cirty/city';
import countrySlice from './slice/country/country';
import eventSlice from './slice/event/event';
import ticketSlice from './slice/ticket/ticket';

const reducer = combineReducers({
    user: userSlice.reducer,
    bus: busSlice.reducer,
    busStop: busStopSlice.reducer,
    route: routeSlice.reducer,
    routeDetail: routeDetailSlice.reducer,
    booking: bookingSlice.reducer,
    store: storeSlice.reducer,
    storeDetail: storeDetailSlice.reducer,
    storeReservation: storeReservationSlice.reducer,
    userSetting: userSettingSlice.reducer,
    adminSetting: adminSettingSlice.reducer,
    commission: commissionSlice.reducer,
    layout: layoutSlice.reducer,
    order: orderSlice.reducer,
    package: packageSlice.reducer,
    city: citySlice.reducer,
    country: countrySlice.reducer,
    event: eventSlice.reducer,
    ticket: ticketSlice.reducer,
});

export type ReducerType = ReturnType<typeof reducer>;
export default reducer;
