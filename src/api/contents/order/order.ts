import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { AxiosResponse } from 'axios';
import { toQueryString } from '../../toQueryString';
import { OrderCancelRequest, OrderCsvRequest, OrderListRequest, OrderListResponse } from './orderType';

export const GET_ORDER_LIST = 'order/GET_ORDER_LIST';
export const CANCEL_ORDER = 'order/CANCEL_ORDER';
export const SAVE_USER_LIST = 'order/SAVE_USER_LIST';
export const GET_ORDER_CSV = 'order/GET_ORDER_CSV';

export const getOrderList = createAsyncThunk<AxiosResponse<OrderListResponse>, OrderListRequest>(
    GET_ORDER_LIST,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/order/list${toQueryString(data)}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const cancelOrder = createAsyncThunk<AxiosResponse<null>, OrderCancelRequest>(
    CANCEL_ORDER,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post('/order/cancel', data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getOrderCSV = createAsyncThunk<AxiosResponse<string>, OrderCsvRequest>(
    GET_ORDER_CSV,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/order/download/list${toQueryString(data)}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
