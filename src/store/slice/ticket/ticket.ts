import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import moment from 'moment-timezone';
import { deleteTicket, getTicketBookingList, issueTicket } from '../../../api/contents/ticket/ticket';

export interface TicketDataType {
    key?: string;
    ticketIdx: number | string;
    ticketDate: string;
    ticketToken: string;
    validity: any | string;
}
interface ContentsState {
    column: ColumnsType<TicketDataType>;
    listLoading: boolean;
    listFailure: boolean;
    deleteLoading: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
    tableData: TicketDataType[];
    total: number;
}

export const initialState: ContentsState = {
    column: [
        { key: 'ticketIdx', title: 'Ticket Idx', dataIndex: 'ticketIdx', align: 'center' },
        { key: 'ticketDate', title: 'Ticket Date', dataIndex: 'ticketDate', align: 'center' },
        { key: 'ticketToken', title: 'QR Preview', dataIndex: 'ticketToken', align: 'center' },
        { key: 'validity', title: 'Validity', dataIndex: 'validity', align: 'center' },
    ],
    listLoading: false,
    listFailure: false,
    deleteLoading: false,
    deleteSuccess: false,
    deleteFailure: false,
    saveLoading: false,
    saveSuccess: false,
    saveFailure: false,
    tableData: [],
    total: 0,
};

const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeInitState: (state) => {
            state.listLoading = false;
            state.listFailure = false;
            state.deleteLoading = false;
            state.deleteSuccess = false;
            state.deleteFailure = false;
            state.saveLoading = false;
            state.saveSuccess = false;
            state.saveFailure = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getTicketBookingList.pending, (state) => {
                state.listLoading = true;
                state.listFailure = false;
            })
            .addCase(getTicketBookingList.fulfilled, (state, action) => {
                const data = action.payload.data;
                let temp: TicketDataType[] = [];
                data.booking_list.forEach((item) => {
                    temp.push({
                        ticketIdx: item.booking_idx,
                        ticketDate:
                            dayjs(item.booking_date_from).format('YYYY-MM-DD HH:mm:ss') +
                            ' ~ ' +
                            dayjs(item.booking_date_to).format('YYYY-MM-DD HH:mm:ss'),
                        ticketToken: item.booking_token,
                        validity:
                            item.booking_date_from > new Date().getTime()
                                ? '0'
                                : item.booking_date_from < new Date().getTime() &&
                                  item.booking_date_to > new Date().getTime()
                                ? '1'
                                : '2',
                        // item.booking_date_from < new Date().getTime() && item.booking_date_to > new Date().getTime()
                        //     ? 'Y'
                        //     : 'N',
                    });
                });

                state.tableData = temp;
                state.total = data.page_info.total;

                state.listLoading = false;
                state.listFailure = false;
            })
            .addCase(getTicketBookingList.rejected, (state) => {
                state.listLoading = false;
                state.listFailure = true;
            })
            .addCase(issueTicket.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(issueTicket.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(issueTicket.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            })
            .addCase(deleteTicket.pending, (state) => {
                state.deleteLoading = true;
                state.deleteSuccess = false;
                state.deleteFailure = false;
            })
            .addCase(deleteTicket.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.deleteFailure = false;
            })
            .addCase(deleteTicket.rejected, (state) => {
                state.deleteLoading = false;
                state.deleteSuccess = false;
                state.deleteFailure = true;
            }),
    /*
            .addCase(deleteRoute.pending, (state) => {})
            .addCase(deleteRoute.fulfilled, (state, action) => {})
            .addCase(deleteRoute.rejected, (state) => {}),

             */
});

export default ticketSlice;
