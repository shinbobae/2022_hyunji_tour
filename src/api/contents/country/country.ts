import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { AxiosResponse } from 'axios';
import { CountryListResponse } from './countryType';

export const GET_COUNTRY_LIST = 'country/GET_COUNTRY_LIST';

export const getCountryList = createAsyncThunk<AxiosResponse<CountryListResponse>>(
    GET_COUNTRY_LIST,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/country/list`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
