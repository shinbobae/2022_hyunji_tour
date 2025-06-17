import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { cancelOrder, getOrderCSV, getOrderList } from '../../../api/contents/order/order';
import { BookingInfoItem } from '../../../api/contents/order/orderType';
import { Table } from 'antd';
import moment from 'moment-timezone';

export interface OrderDataType {
    key?: string;
    orderId: string;
    userIdx: number;
    userName: string;
    userPhone: string;
    orderType: string;
    packageName: string;
    orderStatus: string;
    payAt: string;
    payCancelAt: string;
    orderPrice: string;
    payDisPrice: string;
    payPrice: string;
    payCommission: string;
    pgType: string;
    payCancelComment: string;
    bookingInfoList: BookingInfoItem[];
    orderUpdateDate: string;
}
export type ExpandDataType = BookingInfoItem & {
    key?: string;
};
interface ContentsState {
    column: ColumnsType<OrderDataType>;
    expandColumn: ColumnsType<ExpandDataType>;
    listLoading: boolean;
    listFailure: boolean;
    deleteLoading: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
    downloadLoading: boolean;
    downloadSuccess: boolean;
    downloadFailure: boolean;
    downloadLink: string;
    tableData: OrderDataType[];
    total: number;
}

export const initialState: ContentsState = {
    column: [
        { key: 'orderId', title: '주문 ID', dataIndex: 'orderId' },
        { key: 'userName', title: '이름', dataIndex: 'userName', width: 100 },
        { key: 'userPhone', title: '전화번호', dataIndex: 'userPhone', width: 140 },
        { key: 'orderType', title: '타입', dataIndex: 'orderType', width: 100 },
        // Table.EXPAND_COLUMN,
        { key: 'bookingInfoList', title: '예약목록', dataIndex: 'bookingInfoList', width: 100 },
        // { key: 'bookingInfoList', title: '예약 목록', dataIndex: 'bookingInfoList' },
        { key: 'payAt', title: '결제일시', dataIndex: 'payAt', width: 180 },
        { key: 'payCancelAt', title: '취소일시', dataIndex: 'payCancelAt', width: 180 },
        { key: 'orderPrice', title: '주문금액', dataIndex: 'orderPrice', width: 100 },
        { key: 'payDisPrice', title: '할인금액', dataIndex: 'payDisPrice', width: 100 },
        { key: 'payPrice', title: '결제금액', dataIndex: 'payPrice', width: 100 },
        { key: 'payCommission', title: '수수료', dataIndex: 'payCommission', width: 90 },
        { key: 'orderStatus', title: '주문상태', dataIndex: 'orderStatus', width: 100 },
        { key: 'orderUpdateDate', title: '최종변경일', dataIndex: 'orderUpdateDate', width: 180 },
    ],
    expandColumn: [
        // { key: 'booking_idx', title: '예약 ID', dataIndex: 'booking_idx' },
        { key: 'store_name', title: '예약 스토어', dataIndex: 'store_name' },
        { key: 'goods_name', title: '예약 상품', dataIndex: 'goods_name' },
        { key: 'booking_date', title: '예약 날짜 (현지기준)', dataIndex: 'booking_date' },
        { key: 'use_date', title: '사용 일자 (현지기준)', dataIndex: 'use_date' },
        { key: 'booking_status', title: '주문상태', dataIndex: 'booking_status' },
        { key: 'booking_update_date', title: '최종변경일', dataIndex: 'booking_update_date' },
    ],
    listLoading: false,
    listFailure: false,
    deleteLoading: false,
    deleteSuccess: false,
    deleteFailure: false,
    saveLoading: false,
    saveSuccess: false,
    saveFailure: false,
    downloadLoading: false,
    downloadSuccess: false,
    downloadFailure: false,
    downloadLink: '',
    tableData: [],
    total: 0,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeInitState: (state) => {
            state.listLoading = false;
            state.listFailure = false;
            state.deleteLoading = false;
            state.deleteSuccess = false;
            state.deleteFailure = false;
            state.saveLoading = false;
            state.saveSuccess = false;
            state.saveFailure = false;
            state.downloadLoading = false;
            state.downloadSuccess = false;
            state.downloadFailure = false;
            state.downloadLink = '';
        },
        resetDownload(state) {
            state.downloadSuccess = false;
            state.downloadFailure = false;
            state.downloadLink = '';
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getOrderList.pending, (state) => {
                state.listLoading = false;
                state.listFailure = false;
            })
            .addCase(getOrderList.fulfilled, (state, action) => {
                const data = action.payload.data;
                let temp: OrderDataType[] = [];
                data.order_list.forEach((item, index) => {
                    let orderItem: OrderDataType = {
                        key: `key${item.order_id}${item.pay_at}${index}`,
                        orderId: item.order_id,
                        userIdx: item.user_idx,
                        userName: item.user_name,
                        userPhone: item.user_phone,
                        orderType: item.order_type,
                        packageName: item.package_name || '',
                        orderStatus: item.order_status,
                        payAt: item.pay_at ? dayjs(item.pay_at).format('YYYY-MM-DD HH:mm:ss') : '',
                        payCancelAt: item.pay_cancel_at ? dayjs(item.pay_cancel_at).format('YYYY-MM-DD HH:mm:ss') : '',
                        orderPrice: item.order_price,
                        payDisPrice: item.pay_dis_price,
                        payPrice: item.pay_price,
                        payCommission: item.pay_commission || '-',
                        pgType: item.pg_type,
                        payCancelComment: item.pay_cancel_comment || '',
                        orderUpdateDate: moment(item.update_at).format('YYYY-MM-DD HH:mm:ss'),
                        bookingInfoList: item.booking_info_list.map((booking) => {
                            return {
                                //moment(_).tz(record.tzid)?.format('YYYY-MM-DD HH:mm:ss')
                                ...booking,
                                booking_date_from: booking.booking_date_from
                                    ? moment(booking.booking_date_from)
                                          .tz(booking.store_biz_time_zone_id)
                                          ?.format('YYYY-MM-DD HH:mm:ss')
                                    : '',
                                booking_date_to: booking.booking_date_to
                                    ? moment(booking.booking_date_to)
                                          .tz(booking.store_biz_time_zone_id)
                                          ?.format('YYYY-MM-DD HH:mm:ss')
                                    : '',
                                use_date: booking.use_date
                                    ? moment(booking.use_date)
                                          .tz(booking.store_biz_time_zone_id)
                                          ?.format('YYYY-MM-DD HH:mm:ss')
                                    : '-',
                            };
                        }),
                    };
                    temp.push(orderItem);
                });
                state.tableData = temp;
                state.total = data.page_info.total;
                state.listLoading = false;
                state.listFailure = false;
            })
            .addCase(getOrderList.rejected, (state) => {
                state.listLoading = false;
                state.listFailure = false;
            })
            .addCase(cancelOrder.pending, (state) => {
                state.deleteLoading = true;
                state.deleteSuccess = false;
                state.deleteFailure = false;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.deleteFailure = false;
            })
            .addCase(cancelOrder.rejected, (state) => {
                state.deleteLoading = false;
                state.deleteSuccess = false;
                state.deleteFailure = true;
            })
            .addCase(getOrderCSV.pending, (state) => {
                state.downloadLoading = true;
                state.downloadSuccess = false;
                state.downloadFailure = false;
            })
            .addCase(getOrderCSV.fulfilled, (state, action) => {
                state.downloadLoading = false;
                state.downloadSuccess = true;
                state.downloadFailure = false;
                state.downloadLink = action.payload.data;
            })
            .addCase(getOrderCSV.rejected, (state) => {
                state.downloadLoading = false;
                state.downloadSuccess = false;
                state.downloadFailure = true;
            }),
    /*
            .addCase(deleteRoute.pending, (state) => {})
            .addCase(deleteRoute.fulfilled, (state, action) => {})
            .addCase(deleteRoute.rejected, (state) => {}),
           
             */
});

export default orderSlice;
