import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import { deleteRoute, getRouteAllList, getRouteList, orderSave } from '../../../api/contents/busRoute/busRoute';
import { BusRouteListType, RouteListGetResponse } from '../../../api/contents/busRoute/busRouteType';
import dayjs from 'dayjs';
import { ObjectOption } from '../../../api/type';

export interface RouteDataType {
    key?: string;
    routeId: number;
    routeName: string;
    createdAt: string;
    updatedAt: string;
    busStopInfo: string;
    routeStatus: string;
}
interface ContentsState {
    column: ColumnsType<RouteDataType>;
    routeRespData: RouteListGetResponse | null;
    listLoading: boolean;
    listFailure: boolean;
    deleteLoading: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
    tableData: RouteDataType[];
    routeOrderList: ObjectOption[];
    routeOptionList: ObjectOption[];
    total: number;
    page: number;
    count: number;
    availCount: number;
    closeCount: number;
    totalCount: number;
    orderSaveLoading: boolean;
    orderSaveSuccess: boolean;
    orderSaveFailure: boolean;
}

export const initialState: ContentsState = {
    column: [
        { key: 'routeId', title: 'ID', dataIndex: 'routeId', align: 'center' },
        { key: 'routeName', title: 'Route Name', dataIndex: 'routeName', width: 300 },
        { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt' },
        { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt' },
        { key: 'busStopInfo', title: 'Bus Stop Info', dataIndex: 'busStopInfo' },
        { key: 'routeStatus', title: 'Route Status', dataIndex: 'routeStatus', align: 'center' },
    ],
    routeRespData: null,
    listLoading: false,
    listFailure: false,
    deleteLoading: false,
    deleteSuccess: false,
    deleteFailure: false,
    tableData: [],
    routeOrderList: [],
    routeOptionList: [],
    total: 0,
    page: 1,
    count: 10,
    availCount: 0,
    closeCount: 0,
    totalCount: 0,
    orderSaveLoading: false,
    orderSaveSuccess: false,
    orderSaveFailure: false,
};

const routeSlice = createSlice({
    name: 'route',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeInitState: (state) => {
            state.listLoading = false;
            state.listFailure = false;
            state.deleteLoading = false;
            state.deleteSuccess = false;
            state.deleteFailure = false;
            state.orderSaveLoading = false;
            state.orderSaveSuccess = false;
            state.orderSaveFailure = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getRouteList.pending, (state) => {
                state.deleteSuccess = false;
                state.deleteFailure = false;
                state.listLoading = true;
                state.listFailure = false;
            })
            .addCase(getRouteList.fulfilled, (state, action) => {
                state.listLoading = false;
                const data = action.payload.data;
                state.routeRespData = data;
                state.total = data.page_info ? data.page_info.total : 0;
                state.availCount = data.available_count || 0;
                state.closeCount = data.close_count || 0;
                state.totalCount = data.total_count || 0;
                const temp: RouteDataType[] = [];
                const optionTemp: ObjectOption[] = [];
                data.bus_route_list.forEach((item: BusRouteListType) => {
                    temp.push({
                        key: `key${item.bus_route_idx}${item.create_at}`,
                        routeId: item.bus_route_idx || 0,
                        routeName: item.bus_route_name,
                        createdAt: dayjs(item.create_at).format('YYYY-MM-DD HH:mm:ss'),
                        updatedAt: dayjs(item.update_at).format('YYYY-MM-DD HH:mm:ss'),
                        busStopInfo:
                            item.bus_stop_list.length > 0
                                ? item.bus_stop_list.map((item) => item.bus_stop_name).toString()
                                : '-',
                        routeStatus: item.bus_route_status,
                    });
                    optionTemp.push({
                        label: item.bus_route_name,
                        value: item.bus_route_idx,
                    });
                });
                state.tableData = temp;
                state.routeOptionList = optionTemp;
                state.page = 2;
            })
            .addCase(getRouteList.rejected, (state) => {
                state.listLoading = false;
                state.listFailure = true;
            })
            .addCase(getRouteAllList.pending, (state) => {})
            .addCase(getRouteAllList.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.routeRespData = data;
                let optionTemp: ObjectOption[] = [];
                data.bus_route_list.forEach((item: BusRouteListType) => {
                    optionTemp.push({
                        label: item.bus_route_name,
                        value: item.bus_route_idx,
                    });
                });
                state.routeOrderList = optionTemp;
            })
            .addCase(getRouteAllList.rejected, (state) => {})
            .addCase(deleteRoute.pending, (state) => {
                state.deleteLoading = true;
                state.deleteSuccess = false;
                state.deleteFailure = false;
            })
            .addCase(deleteRoute.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.deleteFailure = false;
            })
            .addCase(deleteRoute.rejected, (state) => {
                state.deleteLoading = false;
                state.deleteSuccess = false;
                state.deleteFailure = true;
            })
            .addCase(orderSave.pending, (state) => {
                state.orderSaveLoading = true;
                state.orderSaveSuccess = false;
                state.orderSaveFailure = false;
            })
            .addCase(orderSave.fulfilled, (state, action) => {
                state.orderSaveLoading = false;
                state.orderSaveSuccess = true;
                state.orderSaveFailure = false;
            })
            .addCase(orderSave.rejected, (state) => {
                state.orderSaveLoading = false;
                state.orderSaveSuccess = false;
                state.orderSaveFailure = true;
            }),
});

export default routeSlice;
