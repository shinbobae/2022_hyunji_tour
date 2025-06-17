import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { AxiosResponse } from 'axios';
import { toQueryString } from '../../toQueryString';
import {
    AddPackageRequest,
    EditPackageRequest,
    PackageGetResponse,
    PackageListRequest,
    PackageListResponse,
} from './packageType';

export const GET_PACKAGE_LIST = 'package/GET_PACKAGE_LIST';
export const GET_PACKAGE = 'package/GET_PACKAGE';
export const SAVE_PACKAGE = 'package/SAVE_PACKAGE';
export const UPLOAD_PACKAGE_IMAGE = 'package/UPLOAD_PACKAGE_IMAGE';
export const DELETE_PACKAGE = 'package/DELETE_PACKAGE';

export const getPackageList = createAsyncThunk<AxiosResponse<PackageListResponse>, PackageListRequest>(
    GET_PACKAGE_LIST,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/package/list${toQueryString(data)}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getPackage = createAsyncThunk<AxiosResponse<PackageGetResponse>, number>(
    GET_PACKAGE,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/package/${data}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const savePackage = createAsyncThunk<AxiosResponse<null>, AddPackageRequest | EditPackageRequest>(
    SAVE_PACKAGE,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post('/package/save', data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const uploadPackageImage = createAsyncThunk<AxiosResponse<string>, FormData>(
    UPLOAD_PACKAGE_IMAGE,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post('/package/upload/image', data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const deletePackage = createAsyncThunk<AxiosResponse<null>, number>(
    DELETE_PACKAGE,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/package/delete/${data}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
