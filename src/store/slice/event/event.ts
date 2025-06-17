import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import { deleteEvent, getEventList, saveEvent, uploadEventImage } from '../../../api/contents/event/event';

export interface EventDataType {
    key?: string;
    eventIdx: number;
    imageUrl: string;
    buttonText: string;
    buttonUrl: string;
    useYn: string;
}
interface ContentsState {
    column: ColumnsType<EventDataType>;
    listLoading: boolean;
    listFailure: boolean;
    deleteLoading: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
    uploadLoading: boolean;
    uploadFailure: boolean;
    uploadResponse: string | null;
    tableData: EventDataType[];
    total: number;
}

export const initialState: ContentsState = {
    column: [
        { key: 'eventIdx', title: 'Event Idx', dataIndex: 'eventIdx', align: 'center' },
        { key: 'imageUrl', title: 'Popup Image', dataIndex: 'imageUrl', align: 'center' },
        { key: 'useYn', title: 'Use Status', dataIndex: 'useYn', align: 'center' },
    ],
    listLoading: false,
    listFailure: false,
    deleteLoading: false,
    deleteSuccess: false,
    deleteFailure: false,
    saveLoading: false,
    saveSuccess: false,
    saveFailure: false,
    uploadLoading: false,
    uploadFailure: false,
    uploadResponse: null,
    tableData: [],
    total: 0,
};

const eventSlice = createSlice({
    name: 'event',
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
            state.uploadLoading = false;
            state.uploadFailure = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getEventList.pending, (state) => {
                state.listLoading = true;
                state.listFailure = false;
            })
            .addCase(getEventList.fulfilled, (state, action) => {
                const data = action.payload.data;
                let temp: EventDataType[] = [];
                data.event_list.forEach((item) => {
                    temp.push({
                        key: `${item.event_idx}`,
                        eventIdx: item.event_idx,
                        imageUrl: item.image_file_url,
                        buttonText: item.button_name,
                        buttonUrl: item.button_url,
                        useYn: item.use_yn,
                    });
                });
                state.tableData = temp;
                state.total = data.page_info.total;

                state.listLoading = false;
                state.listFailure = false;
            })
            .addCase(getEventList.rejected, (state) => {
                state.listLoading = false;
                state.listFailure = true;
            })
            .addCase(saveEvent.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(saveEvent.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(saveEvent.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            })
            .addCase(uploadEventImage.pending, (state) => {
                state.uploadResponse = null;
                state.uploadLoading = true;
                state.uploadFailure = false;
            })
            .addCase(uploadEventImage.fulfilled, (state, action) => {
                state.uploadResponse = action.payload.data;
                state.uploadLoading = false;
                state.uploadFailure = false;
            })
            .addCase(uploadEventImage.rejected, (state) => {
                state.uploadResponse = null;
                state.uploadLoading = false;
                state.uploadFailure = true;
            })
            .addCase(deleteEvent.pending, (state) => {
                state.deleteLoading = true;
                state.deleteSuccess = false;
                state.deleteFailure = false;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.deleteFailure = false;
            })
            .addCase(deleteEvent.rejected, (state) => {
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

export default eventSlice;
