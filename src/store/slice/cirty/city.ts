import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import { getCityList, saveCity } from '../../../api/contents/city/city';
import { ObjectOption } from '../../../api/type';

export interface CityDataType {
    key?: string;
    cityIdx: number;
    countryIdx: number;
    countryName: string;
    cityName: string;
    serviceYn: string;
}
interface ContentsState {
    column: ColumnsType<CityDataType>;
    listLoading: boolean;
    listFailure: boolean;
    deleteLoading: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
    tableData: CityDataType[];
    cityOptionList: ObjectOption[];
    total: number;
}

export const initialState: ContentsState = {
    column: [
        { key: 'cityName', title: 'City Name', dataIndex: 'cityName', align: 'center' },
        { key: 'countryName', title: 'Country Name', dataIndex: 'countryName', align: 'center' },
        { key: 'serviceYn', title: 'Service', dataIndex: 'serviceYn', align: 'center' },
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
    cityOptionList: [],
    total: 0,
};

const citySlice = createSlice({
    name: 'city',
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
            .addCase(getCityList.pending, (state) => {
                state.listLoading = true;
                state.listFailure = false;
            })
            .addCase(getCityList.fulfilled, (state, action) => {
                const data = action.payload.data;
                let temp: CityDataType[] = [];
                let optionTemp: ObjectOption[] = [];
                data.city_list.forEach((item) => {
                    temp.push({
                        key: `${item.city_idx}_${item.city_name}`,
                        cityIdx: item.city_idx,
                        cityName: item.city_name,
                        countryIdx: item.country_idx,
                        countryName: item.country_name,
                        serviceYn: item.service_yn,
                    });
                    optionTemp.push({
                        label: item.city_name,
                        value: item.city_idx,
                    });
                });
                state.tableData = temp;
                state.cityOptionList = optionTemp;
                state.total = data.page_info ? data.page_info.total : optionTemp.length;

                state.listLoading = false;
                state.listFailure = false;
            })
            .addCase(getCityList.rejected, (state) => {
                state.listLoading = false;
                state.listFailure = true;
            })
            .addCase(saveCity.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(saveCity.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(saveCity.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            }),
    /*
            .addCase(deleteRoute.pending, (state) => {})
            .addCase(deleteRoute.fulfilled, (state, action) => {})
            .addCase(deleteRoute.rejected, (state) => {}),

             */
});

export default citySlice;
