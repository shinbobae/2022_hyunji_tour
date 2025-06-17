import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import { addBooking, deleteBooking, getBookingCSV, getBookingList } from '../../../api/contents/booking/booking';
import moment from 'moment';
import dayjs from 'dayjs';
import { BookingUserInfo } from '../../../api/contents/booking/bookingType';

export interface BookingDataType {
    key?: string;
    bookingId: number;
    userName: string;
    bookingTime: string;
    store: string;
    goodsName: string;
    bookingStatus: string;
    bookingToken: string;
    tzid: string;
    userInfo: BookingUserInfo;
}
interface ContentsState {
    column: ColumnsType<BookingDataType>;
    responseData: any;
    tableData: BookingDataType[];
    total: number;
    page: number;
    count: number;
    totalCount: number;
    availCount: number;
    cancelCount: number;
    loadingSuccess: boolean;
    loadingFailure: boolean;
    downloadSuccess: boolean;
    downloadFailure: boolean;
    downloadLink: string;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
    deleteLoading: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
}

export const initialState: ContentsState = {
    column: [
        { key: 'bookingId', title: 'Booking ID', dataIndex: 'bookingId', align: 'center' },
        { key: 'store', title: 'Store', dataIndex: 'store', align: 'center' },
        { key: 'goodsName', title: 'Goods', dataIndex: 'goodsName', align: 'center' },
        { key: 'bookingTime', title: 'Booking Date (현지기준)', dataIndex: 'bookingTime', align: 'center' },
        { key: 'userName', title: 'User Name', dataIndex: 'userName', align: 'center' },
        { key: 'bookingToken', title: 'QR Preview', dataIndex: 'bookingToken', align: 'center' },
        { key: 'bookingStatus', title: 'Booking Status', dataIndex: 'bookingStatus', align: 'center' },
    ],
    responseData: null,
    tableData: [],
    total: 0,
    page: 1,
    count: 20,
    totalCount: 0,
    availCount: 0,
    cancelCount: 0,
    loadingSuccess: false,
    loadingFailure: false,
    downloadSuccess: false,
    downloadFailure: false,
    downloadLink: '',
    saveLoading: false,
    saveSuccess: false,
    saveFailure: false,
    deleteLoading: false,
    deleteSuccess: false,
    deleteFailure: false,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeInitState(state) {
            state.loadingSuccess = false;
            state.loadingFailure = false;
            state.downloadSuccess = false;
            state.downloadFailure = false;
            state.saveLoading = false;
            state.saveSuccess = false;
            state.saveFailure = false;
            state.deleteLoading = false;
            state.deleteSuccess = false;
            state.deleteFailure = false;
        },
        resetDownload(state) {
            state.downloadSuccess = false;
            state.downloadFailure = false;
            state.downloadLink = '';
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getBookingList.pending, (state) => {
                state.loadingSuccess = false;
                state.loadingFailure = false;
            })
            .addCase(getBookingList.fulfilled, (state, action) => {
                state.loadingSuccess = true;
                state.loadingFailure = false;
                const payload = action.payload;

                if (payload.data) {
                    const data = payload.data;
                    state.total = data.page_info.total;
                    state.totalCount = data.total_count;
                    state.availCount = data.available_count;
                    state.cancelCount = data.cancel_count;

                    const temp: BookingDataType[] = [];
                    data.booking_list.forEach((item) => {
                        temp.push({
                            key: `key${item.booking_idx}`,
                            bookingId: item.booking_idx,
                            userName: item.user_info.user_name,
                            bookingTime:
                                moment(item.booking_date_from)
                                    .tz(item.store_biz_time_zone_id)
                                    .format('YYYY-MM-DD HH:mm:ss') +
                                ' ~ ' +
                                moment(item.booking_date_to)
                                    .tz(item.store_biz_time_zone_id)
                                    .format('YYYY-MM-DD HH:mm:ss'),
                            store: item.store_name,
                            goodsName: item.goods_name,
                            bookingStatus: item.booking_status,
                            //0:이용가능, 1:이용완료, 2:취소완료, 3:기간만료, 4:결제대기
                            tzid: item.store_biz_time_zone_id,
                            bookingToken: item.booking_token,
                            userInfo: item.user_info,
                        });
                    });
                    state.tableData = temp;
                }
            })
            .addCase(getBookingList.rejected, (state) => {
                state.loadingSuccess = false;
                state.loadingFailure = true;
            })
            .addCase(getBookingCSV.pending, (state) => {
                state.downloadSuccess = false;
                state.downloadFailure = false;
            })
            .addCase(getBookingCSV.fulfilled, (state, action) => {
                state.downloadSuccess = true;
                state.downloadFailure = false;
                state.downloadLink = action.payload.data;
            })
            .addCase(getBookingCSV.rejected, (state) => {
                state.downloadSuccess = false;
                state.downloadFailure = true;
            })
            .addCase(addBooking.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(addBooking.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(addBooking.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            })
            .addCase(deleteBooking.pending, (state) => {
                state.deleteLoading = true;
                state.deleteSuccess = false;
                state.deleteFailure = false;
            })
            .addCase(deleteBooking.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.deleteFailure = false;
            })
            .addCase(deleteBooking.rejected, (state) => {
                state.deleteLoading = false;
                state.deleteSuccess = false;
                state.deleteFailure = true;
            }),
});

export default bookingSlice;
