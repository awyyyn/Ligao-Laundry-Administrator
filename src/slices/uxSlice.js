import { createSlice } from "@reduxjs/toolkit";


const ux = createSlice({
    name: 'ux',
    initialState: {
        drawerState: false,
        snackbar: {
            isOpen: false,
            message: '',
            type: '',
            color: '',
        },
    },
    reducers: {
        openDrawer: (state) => {
            state.drawerState = true
        },
        closeDrawer: (state) => {
            state.drawerState = false
        },
        toggleSnackBar: ({ snackbar },  { payload } ) => {
            snackbar.isOpen = payload.isOpen;
            snackbar.message = payload.message;
            snackbar.type = payload.type;
            snackbar.color = payload.color
        }
    }
})

export const { openDrawer, closeDrawer, toggleSnackBar } = ux.actions;
export default ux.reducer;