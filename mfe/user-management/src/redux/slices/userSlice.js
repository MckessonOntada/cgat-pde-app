import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    currentPageIndex: 1,
    filters: null,
    message: {
        kind: null,
        text: '',
    }
};

const userSlice = createSlice({
    name: 'user-slice',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
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
    setUsers,
    setCurrentPageIndex,
    setFilters,
    setMessage
} = userSlice.actions;

export default userSlice.reducer;