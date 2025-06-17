import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import {
    getCurrencyType,
    getGoodsType,
    getStore,
    getStoreCategory,
    getStoreGoodsList,
    saveStore,
} from '../../../api/contents/store/store';
import {
    GoodsListItem,
    StoreCategoryTypeItem,
    StoreCurrencyItem,
    StoreGetResponse,
    StoreGoodsItem,
    StoreGoodsTypeItem,
} from '../../../api/contents/store/storeType';
import { ObjectOption } from '../../../api/type';

export interface StoreDetailDataType {
    key?: string;
    goodsId?: number;
    packageYn: string;
    goodsName: string;
    //goodsDesc: string;
    goodsType: number;
    goodsPrice: string;
    goodsCurrency: number;
    maximum: number;
}
interface ContentsState {
    column: ColumnsType<StoreDetailDataType>;
    responseData: any;
    tableData: StoreDetailDataType[];
    total: number;
    page: number;
    count: number;
    detailData: StoreGetResponse | null;
    storeCategoryOptionList: ObjectOption[];
    storeGoodsList: GoodsListItem[];
    storeGoodsTypeOptionList: ObjectOption[];
    storeCurrencyOptionList: ObjectOption[];
    saveSuccess: boolean;
    saveFailure: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
}

export const initialState: ContentsState = {
    column: [
        { key: 'packageYn', title: 'Package type', dataIndex: 'packageYn', align: 'center' },
        { key: 'goodsName', title: 'Goods Name', dataIndex: 'goodsName', align: 'center' },
        { key: 'goodsType', title: 'Goods Type', dataIndex: 'goodsType', align: 'center' },
        { key: 'goodsPrice', title: 'Goods Price', dataIndex: 'goodsPrice', align: 'center' },
        { key: 'goodsCurrency', title: 'Goods Currency', dataIndex: 'goodsCurrency', align: 'center' },
        { key: 'maximum', title: 'maximum', dataIndex: 'maximum' },
        { key: 'action', title: 'Action', dataIndex: 'action' },
    ],
    responseData: null,
    tableData: [],
    total: 0,
    page: 1,
    count: 20,
    detailData: null,
    storeCategoryOptionList: [],
    storeGoodsList: [],
    storeGoodsTypeOptionList: [],
    storeCurrencyOptionList: [],
    saveSuccess: false,
    saveFailure: false,
    deleteSuccess: false,
    deleteFailure: false,
};

const storeDetailSlice = createSlice({
    name: 'store-detail',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeInitState(state) {
            state.saveSuccess = false;
            state.saveFailure = false;
        },
        changeTableData(state, action: PayloadAction<StoreDetailDataType[]>) {
            state.tableData = action.payload;
            state.total = action.payload.length;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getStore.pending, (state) => {})
            .addCase(getStore.fulfilled, (state, action) => {
                const data = action.payload.data;
                const temp: StoreDetailDataType[] = [];
                data.goods_list.forEach((item: StoreGoodsItem) => {
                    temp.push({
                        key: `key${item.goods_idx}`,
                        goodsId: item.goods_idx || 0,
                        packageYn: item.package_goods_yn,
                        goodsName: item.goods_name,
                        goodsType: item.goods_type_idx,
                        goodsPrice: item.goods_price,
                        goodsCurrency: item.currency_idx,
                        maximum: item.max_booking_cnt,
                    });
                });
                state.detailData = data;
                state.tableData = temp;
                state.total = temp.length;
            })
            .addCase(getStore.rejected, (state) => {})
            .addCase(getStoreCategory.pending, (state) => {})
            .addCase(getStoreCategory.fulfilled, (state, action) => {
                const data = action.payload.data;
                const temp: ObjectOption[] = [];
                data.forEach((item: StoreCategoryTypeItem) => {
                    temp.push({
                        value: item.store_category_idx,
                        label: item.store_category_name,
                    });
                });
                state.storeCategoryOptionList = temp;
            })
            .addCase(getStoreCategory.rejected, (state) => {})
            .addCase(getGoodsType.pending, (state) => {})
            .addCase(getGoodsType.fulfilled, (state, action) => {
                const data = action.payload.data;
                const temp: ObjectOption[] = [];
                data.forEach((item: StoreGoodsTypeItem) => {
                    temp.push({
                        value: item.goods_type_idx,
                        label: item.goods_type_name,
                    });
                });
                state.storeGoodsTypeOptionList = temp;
            })
            .addCase(getGoodsType.rejected, (state) => {})
            .addCase(getStoreGoodsList.pending, (state) => {})
            .addCase(getStoreGoodsList.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.storeGoodsList = data;
            })
            .addCase(getStoreGoodsList.rejected, (state) => {})
            .addCase(getCurrencyType.pending, (state) => {})
            .addCase(getCurrencyType.fulfilled, (state, action) => {
                const data = action.payload.data;
                const temp: ObjectOption[] = [];
                data.forEach((item: StoreCurrencyItem) => {
                    temp.push({
                        value: item.currency_idx,
                        label: item.currency_name,
                    });
                });
                state.storeCurrencyOptionList = temp;
            })
            .addCase(getCurrencyType.rejected, (state) => {})
            .addCase(saveStore.pending, (state) => {
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(saveStore.fulfilled, (state, action) => {
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(saveStore.rejected, (state) => {
                state.saveSuccess = false;
                state.saveFailure = true;
            }),
});

export default storeDetailSlice;
