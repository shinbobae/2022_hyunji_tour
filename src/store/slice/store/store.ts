import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import { deleteStore, getStore, getStoreCategory, getStoreList } from '../../../api/contents/store/store';
import { ObjectOption } from '../../../api/type';
import { StoreCategoryTypeItem, StoreGetResponse, StoreListItem } from '../../../api/contents/store/storeType';

export interface StoreDataType {
    key?: string;
    storeId: number;
    storeName: string;
    since: string;
    bizHour: string;
    storeInfo: string;
}
interface ContentsState {
    column: ColumnsType<StoreDataType>;
    responseData: any;
    tableData: StoreDataType[];
    total: number;
    page: number;
    count: number;
    storeOptionList: ObjectOption[];
    openCount: number;
    closeCount: number;
    deleteLoading: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
}

export const initialState: ContentsState = {
    column: [
        {
            key: 'storeId',
            title: 'ID',
            dataIndex: 'storeId',
            align: 'center',
            // render: (id) => id,
        },
        {
            key: 'storeName',
            title: 'Store Name',
            dataIndex: 'storeName',
            align: 'center',
        },
        {
            key: 'since',
            title: 'Since',
            dataIndex: 'since',
            align: 'center',
        },
        {
            key: 'bizHour',
            title: 'Biz Hour',
            dataIndex: 'bizHour',
            align: 'center',
        },
        {
            key: 'storeInfo',
            title: 'Store Info',
            dataIndex: 'storeInfo',
            align: 'center',
        },
    ],
    responseData: null,
    tableData: [],
    total: 0,
    openCount: 0,
    closeCount: 0,
    page: 1,
    count: 20,
    storeOptionList: [],
    deleteLoading: false,
    deleteSuccess: false,
    deleteFailure: false,
};

const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeInitState: (state) => {
            state.deleteLoading = false;
            state.deleteSuccess = false;
            state.deleteFailure = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getStoreList.pending, (state) => {})
            .addCase(getStoreList.fulfilled, (state, action) => {
                const data = action.payload.data;
                const temp: ObjectOption[] = [];
                const tableTemp: StoreDataType[] = [];
                data.store_list.forEach((item: StoreListItem) => {
                    temp.push({
                        value: item.store_idx,
                        label: item.store_name,
                    });
                    tableTemp.push({
                        key: `key${item.store_idx}`,
                        storeId: item.store_idx,
                        storeName: item.store_name,
                        since: item.store_biz_time_from,
                        bizHour: `${item.store_biz_time_from} - ${item.store_biz_time_to}`,
                        storeInfo: item.store_biz_day,
                    });
                });
                state.storeOptionList = temp;
                state.tableData = tableTemp;
                state.total = data.page_info === null ? 0 : data.page_info.total;
            })
            .addCase(getStoreList.rejected, (state) => {})
            .addCase(deleteStore.pending, (state) => {
                state.deleteLoading = true;
                state.deleteSuccess = false;
                state.deleteFailure = false;
            })
            .addCase(deleteStore.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.deleteFailure = false;
            })
            .addCase(deleteStore.rejected, (state) => {
                state.deleteLoading = false;
                state.deleteSuccess = false;
                state.deleteFailure = true;
            }),
});

export default storeSlice;
