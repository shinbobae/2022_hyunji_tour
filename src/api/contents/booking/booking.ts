import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { toQueryString } from '../../toQueryString';
import { AddBookingRequest, BookingDownloadRequest, BookingListRequest, BookingListResponse } from './bookingType';
import { AxiosResponse } from 'axios';

export const GET_BOOKING_LIST = 'booking/GET_BOOKING_LIST';
export const GET_BOOKING_CSV = 'booking/GET_BOOKING_CSV';
export const ADD_BOOKING_CSV = 'booking/ADD_BOOKING_CSV';
export const DELETE_BOOKING_CSV = 'booking/DELETE_BOOKING_CSV';

export const getBookingList = createAsyncThunk<AxiosResponse<BookingListResponse>, BookingListRequest>(
    GET_BOOKING_LIST,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/booking/list${toQueryString(data)}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getBookingCSV = createAsyncThunk(
    GET_BOOKING_CSV,
    async (data: BookingDownloadRequest, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/booking/download/list${toQueryString(data)}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const addBooking = createAsyncThunk<AxiosResponse<null>, AddBookingRequest>(
    ADD_BOOKING_CSV,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/booking/create`, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const deleteBooking = createAsyncThunk<AxiosResponse<null>, { ticket_list: { booking_idx: number }[] }>(
    DELETE_BOOKING_CSV,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/booking/delete`, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
