import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContentsState {
    sidebarCollapse: boolean;
}

export const initialState: ContentsState = {
    sidebarCollapse: false,
};

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        toggleSidebar(state, action: PayloadAction<boolean>) {
            state.sidebarCollapse = action.payload;
        },
        sample(state, action: PayloadAction<boolean>) {
            state.sidebarCollapse = action.payload;
        },
    },
    extraReducers: (builder) => builder,
});

export default layoutSlice;
