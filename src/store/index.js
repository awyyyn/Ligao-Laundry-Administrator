import uxSlice from "../slices/uxSlice.js";
import { configureStore } from "@reduxjs/toolkit";


const store = configureStore({
    reducer: {
        ux: uxSlice
    }
})

export default store;