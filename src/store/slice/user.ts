import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, logout } from '../../api/auth/auth';

interface userState {
    token: string | null;
    user: string | null;
    uuid: string | null;
    loginLoading: boolean;
    loginSuccess: boolean;
    loginFailure: boolean;
}

export const initialState: userState = {
    token: null,
    user: null,
    uuid: null,
    loginLoading: false,
    loginSuccess: false,
    loginFailure: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetState: () => initialState,
        setUuid(state, action: PayloadAction<string>) {
            state.uuid = action.payload;
        },
        resetLoginState: (state) => {
            state.loginLoading = false;
            state.loginSuccess = false;
            state.loginFailure = false;
        },
    },
    extraReducers: (builder) =>
        builder
            // login
            .addCase(login.pending, (state) => {
                state.loginLoading = true;
                state.loginSuccess = false;
                state.loginFailure = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loginLoading = false;
                state.loginSuccess = true;
                // state.token = action.payload.data.login_token;
                state.user = action.payload.data.manager_info.manager_name;
                window.localStorage.setItem('utToken', action.payload.data.login_token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loginLoading = false;
                state.loginSuccess = false;
                state.loginFailure = true;
            })
            .addCase(logout.pending, (state) => {
                //
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.token = null;
                state.user = null;
                window.localStorage.removeItem('utToken');
            })
            .addCase(logout.rejected, (state, action) => {
                //
            }),
});

export default userSlice;
