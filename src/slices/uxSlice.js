import { createSlice } from "@reduxjs/toolkit";


const ux = createSlice({
    name: 'ux',
    initialState: {
        drawerState: false
    },
    reducers: {
        openDrawer: (state) => {
            state.drawerState = true
        },
        closeDrawer: (state) => {
            state.drawerState = false
        }
    }
})

export const { openDrawer, closeDrawer } = ux.actions;
export default ux.reducer;