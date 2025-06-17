import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';

export interface StoreReservationDataType {
    key?: string;
    reserveId: string;
    reservedUserName: string;
    reservedAt: string;
    reservedGoods: string;
    reserveStatus: string;
}
interface ContentsState {
    column: ColumnsType<StoreReservationDataType>;
    responseData: any;
    tableData: StoreReservationDataType[];
    total: number;
    page: number;
    count: number;
}

export const initialState: ContentsState = {
    column: [
        {
            key: 'reserveId',
            title: 'ID',
            dataIndex: 'reserveId',
            align: 'center',
        },
        {
            key: 'reservedUserName',
            title: '예약자명',
            dataIndex: 'reservedUserName',
            align: 'center',
        },
        {
            key: 'reservedAt',
            title: '예약 시간',
            dataIndex: 'reservedAt',
            align: 'center',
        },
        {
            key: 'reservedGoods',
            title: '예약 상품',
            dataIndex: 'reservedGoods',
            align: 'center',
        },
        {
            key: 'reserveStatus',
            title: '상태',
            dataIndex: 'reserveStatus',
            align: 'center',
        },
    ],
    responseData: null,
    tableData: [],
    total: 0,
    page: 1,
    count: 10,
};

const storeReservationSlice = createSlice({
    name: 'store-reservation',
    initialState,
    reducers: {
        resetState: () => initialState,
        setTableData(state) {
            const data: StoreReservationDataType[] = [];

            for (let i = 0; i < 11; i++) {
                data.push({
                    key: `key${i}`,
                    reserveId: `id${i}`,
                    reservedUserName: `예약자명`,
                    reservedAt: `예약 시간${i}`,
                    reservedGoods: `상품이름`,
                    reserveStatus: i % 4 !== 0 ? `승인` : `취소`,
                });
            }
            state.tableData = data;
            state.total = data.length;
        },
        changeTableData(state, action: PayloadAction<StoreReservationDataType[]>) {
            state.tableData = action.payload;
        },
    },
    extraReducers: (builder) => builder,
    /*.addCase(didMain.pending, (state) => {

            })
            .addCase(didMain.fulfilled, (state, action) => {

            })
            .addCase(didMain.rejected, (state) => {

            }),*/
});

export default storeReservationSlice;
