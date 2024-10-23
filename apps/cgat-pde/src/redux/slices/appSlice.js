import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: 'light',
    language: 'english',
    breadcrumbs: []
};

const appSlice = createSlice({
    name: 'app-slice',
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        setBreadcrumbs: (state, action) => {
            state.breadcrumbs = action.payload;
        }
    }
});

export const {
    setLanguage,
    setTheme,
    setBreadcrumbs      
} = appSlice.actions;

export default appSlice.reducer;