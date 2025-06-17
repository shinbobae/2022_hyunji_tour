import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { toQueryString } from '../../toQueryString';
import { BusRouteOrderSaveRequest, BusRouteSaveRequest, RouteListGetResponse, RouteListRequest } from './busRouteType';
import { AxiosResponse } from 'axios';

export const GET_ROUTE_LIST = 'route/GET_ROUTE_LIST';
export const GET_ROUTE_ALL_LIST = 'route/GET_ROUTE_ALL_LIST';
export const GET_ROUTE = 'route/GET_ROUTE';
export const UPLOAD_ROUTE_IMAGE = 'route/UPLOAD_ROUTE_IMAGE';
export const SAVE_ROUTE = 'route/SAVE_ROUTE';
export const DELETE_ROUTE = 'route/DELETE_ROUTE';
export const ORDER_SAVE = 'route/ORDER_SAVE';

export const getRouteList = createAsyncThunk<AxiosResponse<RouteListGetResponse>, RouteListRequest>(
    GET_ROUTE_LIST,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/bus-route/list${toQueryString(data)}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getRouteAllList = createAsyncThunk(GET_ROUTE_ALL_LIST, async (data, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/bus-route/list`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getRoute = createAsyncThunk(GET_ROUTE, async (data: number, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/bus-route/${data}`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const saveRoute = createAsyncThunk(SAVE_ROUTE, async (data: BusRouteSaveRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.post(`/bus-route/save`, data);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const uploadRouteImage = createAsyncThunk(UPLOAD_ROUTE_IMAGE, async (data: FormData, { rejectWithValue }) => {
    try {
        const response = await api_common.post(`/bus-route/upload/image`, data);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteRoute = createAsyncThunk(DELETE_ROUTE, async (data: number, { rejectWithValue }) => {
    try {
        const response = await api_common.post(`/bus-route/delete/${data}`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const orderSave = createAsyncThunk(ORDER_SAVE, async (data: BusRouteOrderSaveRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.post(`/bus-route/order/save`, data);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});
