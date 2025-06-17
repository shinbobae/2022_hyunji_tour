import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { AxiosResponse } from 'axios';
import { CommissionResponse, CommissionSaveRequest } from './commissionType';

export const GET_COMMISSION_LIST = 'commission/GET_COMMISSION_LIST';
export const SAVE_COMMISSION_LIST = 'commission/SAVE_COMMISSION_LIST';

export const getCommissionList = createAsyncThunk(GET_COMMISSION_LIST, async (data, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/commission/list`);
        return response as AxiosResponse<CommissionResponse>;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const saveCommissionList = createAsyncThunk(
    SAVE_COMMISSION_LIST,
    async (data: CommissionSaveRequest, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/commission/save`, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
