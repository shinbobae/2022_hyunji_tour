import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { AxiosResponse } from 'axios';
import { toQueryString } from '../../toQueryString';
import { AddCityRequest, CityListRequest, CityListResponse, EditCityRequest, SaveCityResponse } from './cityType';

export const GET_CITY_LIST = 'city/GET_CITY_LIST';
export const SAVE_CITY_LIST = 'city/SAVE_CITY_LIST';

export const getCityList = createAsyncThunk<AxiosResponse<CityListResponse>, CityListRequest>(
    GET_CITY_LIST,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/city/list${toQueryString(data)}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const saveCity = createAsyncThunk<AxiosResponse<SaveCityResponse>, AddCityRequest | EditCityRequest>(
    SAVE_CITY_LIST,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/city/save`, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
