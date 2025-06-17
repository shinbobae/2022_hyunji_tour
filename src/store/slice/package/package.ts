import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
    deletePackage,
    getPackage,
    getPackageList,
    savePackage,
    uploadPackageImage,
} from '../../../api/contents/package/package';
import { PackageGetResponse } from '../../../api/contents/package/packageType';

export interface PackageDataType {
    key?: string;
    packageIdx: number;
    packageName: string;
    packagePrice: string;
    currencyIdx: number;
    currencyName: string;
    packageImageUrl: string;
}
interface ContentsState {
    column: ColumnsType<PackageDataType>;
    listLoading: boolean;
    listFailure: boolean;
    deleteLoading: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
    detailLoading: boolean;
    detailSuccess: boolean;
    detailFailure: boolean;
    detailData: PackageGetResponse | null;
    uploadLoading: boolean;
    uploadFailure: boolean;
    uploadResponse: string | null;
    tableData: PackageDataType[];
    total: number;
}

export const initialState: ContentsState = {
    column: [
        { key: 'packageName', title: 'Package Name', dataIndex: 'packageName', align: 'center' },
        { key: 'packagePrice', title: 'Package Price', dataIndex: 'packagePrice', align: 'center' },
        { key: 'currencyName', title: 'Currency', dataIndex: 'currencyName', align: 'center' },
        { key: 'packageImageUrl', title: 'Image', dataIndex: 'packageImageUrl', align: 'center' },
    ],
    listLoading: false,
    listFailure: false,
    deleteLoading: false,
    deleteSuccess: false,
    deleteFailure: false,
    saveLoading: false,
    saveSuccess: false,
    saveFailure: false,
    detailLoading: false,
    detailSuccess: false,
    detailFailure: false,
    detailData: null,
    uploadLoading: false,
    uploadFailure: false,
    uploadResponse: null,
    tableData: [],
    total: 0,
};

const packageSlice = createSlice({
    name: 'package',
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
            state.detailLoading = false;
            state.detailSuccess = false;
            state.detailFailure = false;
            state.uploadLoading = false;
            state.uploadFailure = false;
            state.uploadResponse = null;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getPackageList.pending, (state) => {
                state.listLoading = true;
                state.listFailure = false;
            })
            .addCase(getPackageList.fulfilled, (state, action) => {
                const data = action.payload.data;
                let temp: PackageDataType[] = [];
                data.package_list.forEach((item) => {
                    temp.push({
                        key: `${item.package_idx}`,
                        packageIdx: item.package_idx,
                        packageName: item.package_name,
                        packagePrice: item.package_price,
                        currencyIdx: item.currency_idx,
                        currencyName: item.currency_name,
                        packageImageUrl: item.package_image_url,
                    });
                });

                state.tableData = temp;
                state.total = data.page_info.total;

                state.listLoading = false;
                state.listFailure = false;
            })
            .addCase(getPackageList.rejected, (state) => {
                state.listLoading = false;
                state.listFailure = true;
            })
            .addCase(getPackage.pending, (state) => {
                state.detailLoading = true;
                state.detailSuccess = false;
                state.detailFailure = false;
            })
            .addCase(getPackage.fulfilled, (state, action) => {
                state.detailData = action.payload.data;
                state.detailLoading = false;
                state.detailSuccess = true;
                state.detailFailure = false;
            })
            .addCase(getPackage.rejected, (state) => {
                state.detailLoading = false;
                state.detailSuccess = false;
                state.detailFailure = true;
            })
            .addCase(savePackage.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(savePackage.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(savePackage.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            })
            .addCase(uploadPackageImage.pending, (state) => {
                state.uploadLoading = true;
                state.uploadFailure = false;
                state.uploadResponse = null;
            })
            .addCase(uploadPackageImage.fulfilled, (state, action) => {
                state.uploadLoading = false;
                state.uploadFailure = false;
                state.uploadResponse = action.payload.data;
            })
            .addCase(uploadPackageImage.rejected, (state) => {
                state.uploadLoading = false;
                state.uploadFailure = true;
                state.uploadResponse = null;
            })
            .addCase(deletePackage.pending, (state) => {
                state.deleteLoading = true;
                state.deleteSuccess = false;
                state.deleteFailure = false;
            })
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.deleteFailure = false;
            })
            .addCase(deletePackage.rejected, (state) => {
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

export default packageSlice;
