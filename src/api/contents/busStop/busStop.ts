import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { BusStopPostRequest } from './busStopType';

export const GET_BUS_STOP_LIST = 'busStop/GET_BUS_STOP_LIST';
export const SAVE_BUS_STOP = 'busStop/SAVE_BUS_STOP';
export const GET_LOCATION = 'busStop/GET_LOCATION';

export const getBusStopList = createAsyncThunk(GET_BUS_STOP_LIST, async (data, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/bus-stop/list`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const saveBusStop = createAsyncThunk(SAVE_BUS_STOP, async (data: BusStopPostRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.post(`/bus-stop/save`, data);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getLocation = createAsyncThunk(GET_LOCATION, async (data, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/bus-stop/location/list`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});
