import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { toQueryString } from '../../toQueryString';
import { GoodsListRequest, GoodsListResponse, StoreListRequest, StoreSaveRequest } from './storeType';
import { AxiosResponse } from 'axios';

export const GET_STORE_LIST = 'store/GET_STORE_LIST';
export const GET_STORE = 'store/GET_STORE';
export const GET_STORE_CATEGORY = 'store/GET_STORE_CATEGORY';
export const GET_GOODS_TYPE = 'store/GET_GOODS_TYPE';
export const GET_GOODS_LIST = 'store/GET_GOODS_LIST';
export const GET_CURRENCY_TYPE = 'store/GET_CURRENCY_TYPE';
export const SAVE_STORE = 'store/SAVE_STORE';
export const DELETE_STORE = 'store/DELETE_STORE';

export const getStoreList = createAsyncThunk(GET_STORE_LIST, async (data: StoreListRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/store/list${toQueryString(data)}`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getStore = createAsyncThunk(GET_STORE, async (data: number, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/store/${data}`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getStoreCategory = createAsyncThunk(GET_STORE_CATEGORY, async (data, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/store/category/list`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getGoodsType = createAsyncThunk(GET_GOODS_TYPE, async (data, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/store/goods/type/list`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getStoreGoodsList = createAsyncThunk<AxiosResponse<GoodsListResponse>, GoodsListRequest>(
    GET_GOODS_LIST,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.get(
                `/store/${data.storeIdx}/goods/list${toQueryString(data['package-goods-yn'])}`,
            );
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getCurrencyType = createAsyncThunk(GET_CURRENCY_TYPE, async (data, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/store/goods/currency/list`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const saveStore = createAsyncThunk(SAVE_STORE, async (data: StoreSaveRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.post(`/store/save`, data);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteStore = createAsyncThunk(
    SAVE_STORE,
    async (data: { delete_store_list: number[] }, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/store/delete`, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
