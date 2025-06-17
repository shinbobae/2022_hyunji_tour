import { createAsyncThunk } from '@reduxjs/toolkit';
import api_common from 'api/api-common';
import { AxiosResponse } from 'axios';
import { DeleteTicketRequest, IssueTicketRequest } from './ticketType';
import { OrderListRequest, OrderListResponse } from '../order/orderType';
import { toQueryString } from '../../toQueryString';
import { BookingListRequest, BookingListResponse } from '../booking/bookingType';

export const GET_TICKET_LIST = 'ticket/GET_TICKET_LIST';
export const ISSUE_TICKET = 'ticket/ISSUE_TICKET';
export const DELETE_TICKET = 'ticket/DELETE_TICKET';

export const getTicketBookingList = createAsyncThunk<AxiosResponse<BookingListResponse>, BookingListRequest>(
    GET_TICKET_LIST,
    async (data: BookingListRequest, { rejectWithValue }) => {
        try {
            const response = await api_common.get(`/booking/list${toQueryString(data)}`);
            return response as AxiosResponse<BookingListResponse>;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const issueTicket = createAsyncThunk<AxiosResponse<any>, IssueTicketRequest>(
    ISSUE_TICKET,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/ticket/issue`, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const deleteTicket = createAsyncThunk<AxiosResponse<any>, DeleteTicketRequest>(
    DELETE_TICKET,
    async (data, { rejectWithValue }) => {
        try {
            const response = await api_common.post(`/ticket/delete`, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
