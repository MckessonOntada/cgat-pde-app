import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./slices/ordersSlice";

const store = configureStore({
    reducer: {
        orders: ordersReducer
    },
});

export default store;