import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import {
    deleteManager,
    editManager,
    getManager,
    getManagerList,
    getManagerRoleList,
    saveManager,
} from '../../../api/contents/manage/manage';
import {
    ManageListResponseItem,
    ManagerGetResponse,
    ManageRoleResponse,
    ManageRoleResponseItem,
} from '../../../api/contents/manage/manageType';
import { ObjectOption } from '../../../api/type';
import moment from 'moment';

export interface AdminSettingDataType {
    key?: string;
    adminIdx: number;
    adminID: string;
    adminName: string;
    adminTel: string;
    adminCreateAt: string;
    adminStatus: string;
}
interface ContentsState {
    column: ColumnsType<AdminSettingDataType>;
    responseData: any;
    tableData: AdminSettingDataType[];
    adminOptionList: ObjectOption[];
    total: number;
    page: number;
    count: number;
    roleList: ObjectOption[];
    detailData: null | ManagerGetResponse;
    loadingSuccess: boolean;
    loadingFailure: boolean;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
    deleteLoading: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
}

export const initialState: ContentsState = {
    column: [
        { key: 'adminName', title: '관리자명', dataIndex: 'adminName' },
        { key: 'adminID', title: 'ID', dataIndex: 'adminID' },
        { key: 'adminTel', title: '전화번호', dataIndex: 'adminTel' },
        { key: 'adminCreateAt', title: '등록일', dataIndex: 'adminCreateAt' },
        { key: 'adminStatus', title: '상태', dataIndex: 'adminStatus', align: 'center' },
    ],
    responseData: null,
    tableData: [],
    adminOptionList: [],
    total: 0,
    page: 1,
    count: 20,
    roleList: [],
    detailData: null,
    loadingSuccess: false,
    loadingFailure: false,
    saveLoading: false,
    saveSuccess: false,
    saveFailure: false,
    deleteLoading: false,
    deleteSuccess: false,
    deleteFailure: false,
};

const adminSettingSlice = createSlice({
    name: 'admin-setting',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeInitState: (state) => {
            state.loadingSuccess = false;
            state.loadingFailure = false;
            state.saveLoading = false;
            state.saveSuccess = false;
            state.saveFailure = false;
            state.deleteLoading = false;
            state.deleteSuccess = false;
            state.deleteFailure = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getManagerList.pending, (state) => {
                state.loadingSuccess = false;
                state.loadingFailure = false;
            })
            .addCase(getManagerList.fulfilled, (state, action) => {
                const data = action.payload.data;
                const temp: AdminSettingDataType[] = [];
                const optionTemp: ObjectOption[] = [];
                data.manager_list.forEach((item: ManageListResponseItem) => {
                    temp.push({
                        key: `key${item.manager_idx.toString()}`,
                        adminIdx: item.manager_idx,
                        adminID: item.manager_email,
                        adminName: item.manager_name,
                        adminTel: item.manager_phone,
                        adminCreateAt: moment(item.create_at).format('YYYY-MM-DD HH:mm:ss'),
                        adminStatus: item.suspend_yn,
                    });
                    optionTemp.push({
                        label: item.manager_name,
                        value: item.manager_idx,
                    });
                });
                state.tableData = temp;
                state.adminOptionList = optionTemp;
                state.total = data.page_info?.total;

                state.loadingSuccess = true;
                state.loadingFailure = false;
            })
            .addCase(getManagerList.rejected, (state) => {
                state.loadingSuccess = false;
                state.loadingFailure = true;
            })
            .addCase(getManagerRoleList.pending, (state) => {})
            .addCase(getManagerRoleList.fulfilled, (state, action) => {
                const data = action.payload.data;
                const temp: ObjectOption[] = [];
                data.forEach((item: ManageRoleResponseItem) => {
                    temp.push({
                        value: item.manager_role_idx,
                        label: item.manager_role_name,
                    });
                });
                state.roleList = temp;
            })
            .addCase(getManager.rejected, (state) => {})
            .addCase(getManager.pending, (state) => {})
            .addCase(getManager.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.detailData = data;
            })
            .addCase(getManagerRoleList.rejected, (state) => {})
            .addCase(saveManager.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(saveManager.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(saveManager.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            })
            .addCase(editManager.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(editManager.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(editManager.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            })
            .addCase(deleteManager.pending, (state) => {
                state.deleteLoading = true;
                state.deleteSuccess = false;
                state.deleteFailure = false;
            })
            .addCase(deleteManager.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.deleteFailure = false;
            })
            .addCase(deleteManager.rejected, (state) => {
                state.deleteLoading = false;
                state.deleteSuccess = false;
                state.deleteFailure = true;
            }),
});

export default adminSettingSlice;
