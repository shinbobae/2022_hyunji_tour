import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { toQueryString } from '../../toQueryString';
import { BusDeleteRequest, BusLocationRequest, BusLocationResponse, BusSaveRequest } from './busType';
import { PageRequest } from '../../type';
import { AxiosResponse } from 'axios';

export const GET_BUS_LIST = 'bus/GET_BUS_LIST';
export const SAVE_BUS = 'bus/SAVE_BUS';
export const DELETE_BUS = 'bus/DELETE_BUS';
export const GET_BUS_LOCATION = 'bus/GET_BUS_LOCATION';
export const FIX_BUS_LOCATION_FORCE = 'bus/FIX_BUS_LOCATION_FORCE';

export const getBusList = createAsyncThunk(GET_BUS_LIST, async (data: PageRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/bus/list${toQueryString(data)}`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const saveBus = createAsyncThunk(SAVE_BUS, async (data: BusSaveRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.post(`/bus/save`, data);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteBus = createAsyncThunk(DELETE_BUS, async (data: BusDeleteRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.post(`/bus/delete`, data);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getBusLocation = createAsyncThunk<AxiosResponse<BusLocationResponse>, BusLocationRequest>(
    GET_BUS_LOCATION,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/bus/location${toQueryString(data)}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const fixBusLocationForce = createAsyncThunk<AxiosResponse<null>, { busIdx: number; lon: number; lat: number }>(
    FIX_BUS_LOCATION_FORCE,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/bus/${data.busIdx}/location/force`, {
                latitude: data.lat,
                longitude: data.lon,
            });
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
