import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
    currentPageIndex: 1,
    filters: null,
    message: {
        kind: null,
        text: '',
    }
};

const ordersSlice = createSlice({
    name: 'orders-slice',
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        setCurrentPageIndex: (state, action) => {
            state.currentPageIndex = action.payload;
        },
        setFilters: (state, action) => {
            state.filter = action.payload;
        },
        setMessage: (state, action) => {
            const { kind, text } = action.payload;
            state.message = { kind, text }
        }
    }
});

export const {
    setOrders,
    setCurrentPageIndex,
    setFilters,
    setMessage
} = ordersSlice.actions;

export default ordersSlice.reducer;