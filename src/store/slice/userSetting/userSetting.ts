import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColumnsType } from 'antd/es/table';
import { deleteUserList, editUser, getUserList, saveUser } from '../../../api/contents/user/user';
import moment from 'moment';

export interface UserSettingDataType {
    key: string;
    userIdx: number;
    userName: string;
    userEmail: string;
    userTel: string;
    userCreateAt: string;
    userStatus: string;
}
interface ContentsState {
    column: ColumnsType<UserSettingDataType>;
    responseData: any;
    tableData: UserSettingDataType[];
    total: number;
    page: number;
    count: number;
    listLoading: boolean;
    listFailure: boolean;
    saveLoading: boolean;
    saveSuccess: boolean;
    saveFailure: boolean;
    deleteLoading: boolean;
    deleteSuccess: boolean;
    deleteFailure: boolean;
}

export const initialState: ContentsState = {
    column: [
        { key: 'userName', title: 'User Name', dataIndex: 'userName' },
        { key: 'userEmail', title: 'User Email', dataIndex: 'userEmail' },
        { key: 'userTel', title: 'user Tel', dataIndex: 'userTel' },
        { key: 'userCreateAt', title: 'Created At', dataIndex: 'userCreateAt' },
        { key: 'userStatus', title: 'User Status', dataIndex: 'userStatus', align: 'center' },
    ],
    responseData: null,
    tableData: [],
    total: 0,
    page: 1,
    count: 20,
    listLoading: false,
    listFailure: false,
    saveLoading: false,
    saveSuccess: false,
    saveFailure: false,
    deleteLoading: false,
    deleteSuccess: false,
    deleteFailure: false,
};

const userSettingSlice = createSlice({
    name: 'user-setting',
    initialState,
    reducers: {
        resetState: () => initialState,
        changeInitState: (state) => {
            state.listLoading = false;
            state.listFailure = false;
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
            .addCase(getUserList.pending, (state) => {
                state.listLoading = true;
                state.listFailure = false;
            })
            .addCase(getUserList.fulfilled, (state, action) => {
                const data = action.payload.data;
                let temp: UserSettingDataType[] = [];
                data.user_list.forEach((item) => {
                    temp.push({
                        key: item.user_idx.toString(),
                        userIdx: item.user_idx,
                        userName: item.user_name,
                        userEmail: item.user_email,
                        userTel: item.user_phone,
                        userCreateAt: moment(item.create_at).format('YYYY-MM-DD HH:mm:ss'),
                        userStatus: item.del_yn,
                    });
                });
                state.tableData = temp;
                state.total = data.page_info.total;
                state.listLoading = false;
                state.listFailure = false;
            })
            .addCase(getUserList.rejected, (state) => {
                state.listLoading = false;
                state.listFailure = true;
            })
            .addCase(deleteUserList.pending, (state) => {
                state.deleteLoading = true;
                state.deleteSuccess = false;
                state.deleteFailure = false;
            })
            .addCase(deleteUserList.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.deleteFailure = false;
            })
            .addCase(deleteUserList.rejected, (state) => {
                state.deleteLoading = false;
                state.deleteSuccess = false;
                state.deleteFailure = true;
            })
            .addCase(saveUser.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(saveUser.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(saveUser.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            })
            .addCase(editUser.pending, (state) => {
                state.saveLoading = true;
                state.saveSuccess = false;
                state.saveFailure = false;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.saveLoading = false;
                state.saveSuccess = true;
                state.saveFailure = false;
            })
            .addCase(editUser.rejected, (state) => {
                state.saveLoading = false;
                state.saveSuccess = false;
                state.saveFailure = true;
            }),
});

export default userSettingSlice;
