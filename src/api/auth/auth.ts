import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    ChangePasswordRequest,
    ChangeUserInfoRequest,
    EmailAuthConfirm,
    EmailAuthRequest,
    LoginRequest,
    LogoutRequest,
    RegisterRequest,
} from './authType';
import api_common from '../api-common';
import { ResultResponse } from '../type';
import { AxiosPromise } from 'axios';

export const LOGIN = 'user/LOGIN';
export const LOGOUT = 'user/LOGOUT';

export const login = createAsyncThunk(LOGIN, async (data: LoginRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.post('/manager/login', data);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const logout = createAsyncThunk(LOGOUT, async (data: LogoutRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.post('manager/logout', data);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});
