import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCommissionList, saveCommissionList } from '../../../api/contents/commission/commission';
import { CommissionResponse } from '../../../api/contents/commission/commissionType';

interface ContentsState {
    commissionData: CommissionResponse | null;
    dataLoading: boolean;
    dataFailure: boolean;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
}

export const initialState: ContentsState = {
    commissionData: null,
    dataLoading: false,
    dataFailure: false,
    saveLoading: false,
    saveSuccess: false,
    saveFailure: false,
};

const commissionSlice = createSlice({
    name: 'commission',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeInitState: (state) => {
            state.dataLoading = false;
            state.dataFailure = false;
            state.saveLoading = false;
            state.saveSuccess = false;
            state.saveFailure = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getCommissionList.pending, (state) => {
                state.dataLoading = true;
                state.dataFailure = false;
                state.commissionData = null;
            })
            .addCase(getCommissionList.fulfilled, (state, action) => {
                state.commissionData = action.payload.data;
                state.dataLoading = false;
                state.dataFailure = false;
            })
            .addCase(getCommissionList.rejected, (state) => {
                state.dataLoading = false;
                state.dataFailure = true;
                state.commissionData = null;
            })
            .addCase(saveCommissionList.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(saveCommissionList.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(saveCommissionList.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            }),
});

export default commissionSlice;
