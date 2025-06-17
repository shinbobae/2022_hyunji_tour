import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { AxiosResponse } from 'axios';
import { toQueryString } from '../../toQueryString';
import { AddEventRequest, EditEventRequest, EventListItem, EventListRequest, EventListResponse } from './eventType';

export const GET_EVENT_LIST = 'event/GET_EVENT_LIST';
export const SAVE_EVENT = 'event/SAVE_EVENT';
export const UPLOAD_EVENT_IMAGE = 'event/UPLOAD_EVENT_IMAGE';
export const DELETE_EVENT = 'event/DELETE_EVENT';

export const getEventList = createAsyncThunk<AxiosResponse<EventListResponse>, EventListRequest>(
    GET_EVENT_LIST,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/event/list${toQueryString(data)}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const saveEvent = createAsyncThunk<AxiosResponse<EventListItem>, AddEventRequest | EditEventRequest>(
    SAVE_EVENT,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/event/save`, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const uploadEventImage = createAsyncThunk<AxiosResponse<string>, FormData>(
    UPLOAD_EVENT_IMAGE,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/event/upload/image`, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const deleteEvent = createAsyncThunk<AxiosResponse<null>, { event_idx_list: number[] }>(
    DELETE_EVENT,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/event/delete`, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
