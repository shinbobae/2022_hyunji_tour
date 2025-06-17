import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { AxiosResponse } from 'axios';
import { EditUserRequest, SaveUserRequest, SaveUserResponse, UserListRequest, UserListResponse } from './userType';
import { toQueryString } from '../../toQueryString';

export const GET_USER_LIST = 'user/GET_USER_LIST';
export const DELETE_USER_LIST = 'user/DELETE_USER_LIST';
export const SAVE_USER_LIST = 'user/SAVE_USER_LIST';
export const EDIT_USER_LIST = 'user/EDIT_USER_LIST';

export const getUserList = createAsyncThunk(GET_USER_LIST, async (data: UserListRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/user/list${toQueryString(data)}`);
        return response as AxiosResponse<UserListResponse>;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteUserList = createAsyncThunk(
    DELETE_USER_LIST,
    async (data: { delete_user_list: number[] }, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/user/delete`, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const saveUser = createAsyncThunk<AxiosResponse<SaveUserResponse>, SaveUserRequest>(
    SAVE_USER_LIST,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post('/user/save', data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const editUser = createAsyncThunk<AxiosResponse<SaveUserResponse>, EditUserRequest>(
    EDIT_USER_LIST,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post('/user/edit', data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
