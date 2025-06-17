import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import { deleteBus, fixBusLocationForce, getBusList, getBusLocation, saveBus } from '../../../api/contents/bus/bus';
import { BusItem, BusLocationResponse } from '../../../api/contents/bus/busType';

export interface BusDataType {
    key?: string;
    busId: number;
    busName: string;
    busRoute: number;
    busManager: any;
    busManagerIdx: number;
    busStatus: string;
}
interface ContentsState {
    column: ColumnsType<BusDataType>;
    tableData: BusDataType[];
    total: number;
    page: number;
    count: number;
    modalMode: string;
    listLoading: boolean;
    listFailure: boolean;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
    deleteLoading: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
    busLocationLoading: boolean;
    busLocationSuccess: boolean;
    busLocationFailure: boolean;
    busLocationData: BusLocationResponse;
    fixBusLocationLoading: boolean;
    fixBusLocationSuccess: boolean;
    fixBusLocationFailure: boolean;
}

export const initialState: ContentsState = {
    column: [
        { key: 'busId', title: 'Id', dataIndex: 'busId' },
        { key: 'busName', title: 'Bus Name', dataIndex: 'busName' },
        { key: 'busRoute', title: 'Bus Route Number', dataIndex: 'busRoute' },
        { key: 'busManager', title: 'Bus Manager', dataIndex: 'busManager' },
        { key: 'busStatus', title: 'Bus Status', dataIndex: 'busStatus' },
    ],
    tableData: [],
    total: 0,
    page: 1,
    count: 20,
    modalMode: '',
    listLoading: false,
    listFailure: false,
    saveLoading: false,
    saveSuccess: false,
    saveFailure: false,
    deleteLoading: false,
    deleteSuccess: false,
    deleteFailure: false,
    busLocationLoading: false,
    busLocationSuccess: false,
    busLocationFailure: false,
    busLocationData: [],
    fixBusLocationLoading: false,
    fixBusLocationSuccess: false,
    fixBusLocationFailure: false,
};

const busSlice = createSlice({
    name: 'bus',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeModalMode(state, action: PayloadAction<string>) {
            state.modalMode = action.payload;
        },
        changeInitState(state) {
            state.listLoading = false;
            state.listFailure = false;
            state.saveLoading = false;
            state.saveSuccess = false;
            state.saveFailure = false;
            state.deleteLoading = false;
            state.deleteSuccess = false;
            state.deleteFailure = false;
            state.busLocationLoading = false;
            state.busLocationSuccess = false;
            state.busLocationFailure = false;
            state.fixBusLocationLoading = false;
            state.fixBusLocationSuccess = false;
            state.fixBusLocationFailure = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getBusList.pending, (state) => {
                state.listLoading = true;
                state.listFailure = false;
            })
            .addCase(getBusList.fulfilled, (state, action) => {
                const data = action.payload.data.bus_list as BusItem[];
                const temp: BusDataType[] = [];

                data.forEach((item: BusItem) => {
                    temp.push({
                        key: `key${item.bus_idx}`,
                        busId: item.bus_idx,
                        busName: item.bus_name,
                        busRoute: item.bus_route_idx,
                        busManager: item.manager_name || '-',
                        busManagerIdx: item.manager_idx,
                        busStatus: item.drive_yn,
                    });
                });

                state.tableData = temp;
                state.total = action.payload.data.page_info.total;
                state.listLoading = false;
                state.listFailure = false;
            })
            .addCase(getBusList.rejected, (state) => {
                state.listLoading = false;
                state.listFailure = true;
            })
            .addCase(saveBus.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(saveBus.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(saveBus.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            })
            .addCase(deleteBus.pending, (state) => {
                state.deleteLoading = true;
                state.deleteSuccess = false;
                state.deleteFailure = false;
            })
            .addCase(deleteBus.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.deleteFailure = false;
            })
            .addCase(deleteBus.rejected, (state) => {
                state.deleteLoading = false;
                state.deleteSuccess = false;
                state.deleteFailure = true;
            })
            .addCase(getBusLocation.pending, (state) => {
                state.busLocationLoading = true;
                state.busLocationSuccess = false;
                state.busLocationFailure = false;
            })
            .addCase(getBusLocation.fulfilled, (state, action) => {
                state.busLocationLoading = false;
                state.busLocationSuccess = true;
                state.busLocationFailure = false;
                state.busLocationData = action.payload.data;
            })
            .addCase(getBusLocation.rejected, (state) => {
                state.busLocationLoading = false;
                state.busLocationSuccess = false;
                state.busLocationFailure = true;
            })
            .addCase(fixBusLocationForce.pending, (state) => {
                state.fixBusLocationLoading = true;
                state.fixBusLocationSuccess = false;
                state.fixBusLocationFailure = false;
            })
            .addCase(fixBusLocationForce.fulfilled, (state, action) => {
                state.fixBusLocationLoading = false;
                state.fixBusLocationSuccess = true;
                state.fixBusLocationFailure = false;
            })
            .addCase(fixBusLocationForce.rejected, (state) => {
                state.fixBusLocationLoading = false;
                state.fixBusLocationSuccess = false;
                state.fixBusLocationFailure = true;
            }),
});

export default busSlice;
