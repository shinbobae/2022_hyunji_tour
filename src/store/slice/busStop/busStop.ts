import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import { getBusStopList, saveBusStop } from '../../../api/contents/busStop/busStop';
import { BusStopItem } from '../../../api/contents/busStop/busStopType';

export interface BusStopDataType {
    key?: string;
    routeNo?: number;
    routeId?: number;
    useYn: string;
    routeName: string;
    description: string;
    cityIdx: number;
    cityName: string;
    location: string;
    latitude: number;
    longitude: number;
}
interface ContentsState {
    column: ColumnsType<BusStopDataType>;
    busStopList: BusStopDataType[];
    total: number;
    page: number;
    count: number;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
}

export const initialState: ContentsState = {
    column: [
        { key: 'routeName', title: 'Name', dataIndex: 'routeName', width: 160 },
        { key: 'useYn', title: '사용여부', dataIndex: 'useYn', width: 100 },
        { key: 'cityName', title: 'city', dataIndex: 'cityName', width: 200 },
        { key: 'latitude', title: 'latitude', dataIndex: 'latitude' },
        // { key: 'location', title: 'location', dataIndex: 'location' },
        { key: 'longitude', title: 'longitude', dataIndex: 'longitude' },
        { key: 'action', title: 'Action', dataIndex: 'action' },
    ],
    busStopList: [],
    total: 0,
    page: 1,
    count: 20,
    saveLoading: false,
    saveSuccess: false,
    saveFailure: false,
};

const busStopSlice = createSlice({
    name: 'busStop',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeTableData(state, action: PayloadAction<BusStopDataType[]>) {
            state.busStopList = action.payload;
            state.total = action.payload.length;
        },
        changeInitState(state) {
            state.saveLoading = false;
            state.saveSuccess = false;
            state.saveFailure = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getBusStopList.pending, (state) => {})
            .addCase(getBusStopList.fulfilled, (state, action) => {
                const data = action.payload.data as BusStopItem[];
                const temp: BusStopDataType[] = [];
                data.forEach((busStop, index) => {
                    temp.push({
                        key: `key${index}${busStop.bus_stop_idx}`,
                        useYn: busStop.use_yn,
                        routeId: busStop.bus_stop_idx,
                        routeName: busStop.bus_stop_name,
                        location: busStop.location_name,
                        description: '',
                        latitude: Number(busStop.location_lat),
                        longitude: Number(busStop.location_lon),
                        cityIdx: busStop.city_idx,
                        cityName: busStop.city_name,
                    });
                });
                state.busStopList = temp;
                state.total = temp.length;
            })
            .addCase(getBusStopList.rejected, (state) => {})
            .addCase(saveBusStop.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(saveBusStop.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(saveBusStop.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            }),
});

export default busStopSlice;
