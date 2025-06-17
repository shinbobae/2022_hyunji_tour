import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { toQueryString } from '../../toQueryString';
import { ManageEditRequest, ManageGetRequest, ManageSaveRequest } from './manageType';

export const GET_MANAGER_LIST = 'MANAGER/GET_MANAGER_LIST';
export const GET_MANAGER_ROLE_LIST = 'MANAGER/GET_MANAGER_ROLE_LIST';
export const DELETE_MANAGER = 'MANAGER/DELETE_MANAGER';
export const SAVE_MANAGER = 'MANAGER/SAVE_MANAGER';
export const EDIT_MANAGER = 'MANAGER/EDIT_MANAGER';
export const GET_MANAGER = 'MANAGER/GET_MANAGER';

export const getManagerList = createAsyncThunk(
    GET_MANAGER_LIST,
    async (data: ManageGetRequest, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/manager/list${toQueryString(data)}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getManagerRoleList = createAsyncThunk(GET_MANAGER_ROLE_LIST, async (data, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/manager/role/list`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteManager = createAsyncThunk(DELETE_MANAGER, async (data: number, { rejectWithValue }) => {
    try {
        const response = await api_common.post(`/manager/delete/${data}`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const saveManager = createAsyncThunk(SAVE_MANAGER, async (data: ManageSaveRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.post(`/manager/save`, data);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const editManager = createAsyncThunk(EDIT_MANAGER, async (data: ManageEditRequest, { rejectWithValue }) => {
    try {
        const response = await api_common.post(`/manager/edit`, data);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getManager = createAsyncThunk(GET_MANAGER, async (data: Number, { rejectWithValue }) => {
    try {
        const response = await api_common.get(`/manager/${data}`);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});
