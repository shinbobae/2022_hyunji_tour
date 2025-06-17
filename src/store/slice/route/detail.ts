import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import { BusRouteGetResponse, BusRoutePositionItem } from '../../../api/contents/busRoute/busRouteType';
import { getRoute, saveRoute, uploadRouteImage } from '../../../api/contents/busRoute/busRoute';

export interface RouteLocationDataType {
    key?: string;
    routeId?: number;
    routeNo: number;
    routeName: string;
    description: string;
    type?: string | number;
    bookmarkYn: string;
    latitude: number;
    longitude: number;
    duration: string;
    positionIdx: number | null;
}
interface ContentsState {
    dataLoading: boolean;
    dataFailure: boolean;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
    routeDetailData: BusRouteGetResponse | null;
    column: ColumnsType<RouteLocationDataType>;
    tableData: RouteLocationDataType[];
    total: number;
    uploadLoading: boolean;
    uploadFailure: boolean;
    uploadResponse: null | string;
}

export const initialState: ContentsState = {
    dataLoading: false,
    dataFailure: false,
    saveLoading: false,
    saveSuccess: false,
    saveFailure: false,
    routeDetailData: null,
    column: [
        { key: 'routeNo', title: 'No', dataIndex: 'routeNo', width: '60px' },
        { key: 'routeName', title: 'Name', dataIndex: 'routeName' },
        { key: 'type', title: 'Type', dataIndex: 'type' },
        { key: 'duration', title: 'Duration', dataIndex: 'duration' },
        { key: 'bookmarkYn', title: 'Bookmark', dataIndex: 'bookmarkYn' },
        { key: 'latitude', title: 'latitude', dataIndex: 'latitude' },
        { key: 'longitude', title: 'longitude', dataIndex: 'longitude' },
        // { key: 'description', title: 'Description', dataIndex: 'description' },
        { key: 'action', title: 'Action', dataIndex: 'action' },
    ],
    tableData: [],
    total: 0,
    uploadLoading: false,
    uploadFailure: false,
    uploadResponse: null,
};

const routeDetailSlice = createSlice({
    name: 'route-detail',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeTableData(state, action: PayloadAction<RouteLocationDataType[]>) {
            state.tableData = action.payload;
            state.total = action.payload.length;
        },
        changeInitState(state) {
            state.saveLoading = false;
            state.saveSuccess = false;
            state.saveFailure = false;
            state.uploadLoading = false;
            state.uploadFailure = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getRoute.pending, (state) => {
                state.dataLoading = true;
                state.routeDetailData = null;
                state.dataFailure = false;
            })
            .addCase(getRoute.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.routeDetailData = data;
                const temp: RouteLocationDataType[] = [];
                data.bus_route_position_list.forEach((item: BusRoutePositionItem, index: number) => {
                    temp.push({
                        key: `key${index}`,
                        routeId: item.bus_stop_idx || 0,
                        routeNo: item.location_seq_no,
                        routeName: item.bus_route_position_name,
                        description: item.bus_route_position_description,
                        type: item.bus_stop_idx === null ? '1' : '2',
                        latitude: item.location_lat,
                        longitude: item.location_lon,
                        duration: item.bus_route_duration.toString(),
                        positionIdx: item.bus_route_position_idx,
                        bookmarkYn: item.bookmark_yn !== '' ? item.bookmark_yn : 'N',
                    });
                });
                state.tableData = temp;
                state.total = temp.length;
                state.dataLoading = false;
                state.dataFailure = false;
            })
            .addCase(getRoute.rejected, (state) => {})
            .addCase(saveRoute.pending, (state) => {
                state.routeDetailData = null;
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(saveRoute.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(saveRoute.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            })
            .addCase(uploadRouteImage.pending, (state) => {
                state.uploadLoading = true;
                state.uploadFailure = false;
                state.uploadResponse = null;
            })
            .addCase(uploadRouteImage.fulfilled, (state, action) => {
                state.uploadLoading = false;
                state.uploadFailure = false;
                state.uploadResponse = action.payload.data;
            })
            .addCase(uploadRouteImage.rejected, (state) => {
                state.uploadLoading = false;
                state.uploadFailure = true;
                state.uploadResponse = null;
            }),
});

export default routeDetailSlice;
