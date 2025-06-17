import { createSlice } from '@reduxjs/toolkit';
import { getCountryList } from '../../../api/contents/country/country';
import { ObjectOption } from '../../../api/type';

interface ContentsState {
    listLoading: boolean;
    listFailure: boolean;
    countryOptionList: ObjectOption[];
    total: number;
}

export const initialState: ContentsState = {
    listLoading: false,
    listFailure: false,
    countryOptionList: [],
    total: 0,
};

const countrySlice = createSlice({
    name: 'country',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeInitState: (state) => {
            state.listLoading = false;
            state.listFailure = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getCountryList.pending, (state) => {
                state.listLoading = true;
                state.listFailure = false;
            })
            .addCase(getCountryList.fulfilled, (state, action) => {
                const data = action.payload.data;
                let temp: ObjectOption[] = [];
                data.forEach((item) => {
                    temp.push({
                        value: item.country_idx,
                        label: item.country_name,
                    });
                });
                state.countryOptionList = temp;
                state.total = data.length;

                state.listLoading = false;
                state.listFailure = false;
            })
            .addCase(getCountryList.rejected, (state) => {
                state.listLoading = false;
                state.listFailure = true;
            }),
    /*
            .addCase(deleteRoute.pending, (state) => {})
            .addCase(deleteRoute.fulfilled, (state, action) => {})
            .addCase(deleteRoute.rejected, (state) => {}),

             */
});

export default countrySlice;
