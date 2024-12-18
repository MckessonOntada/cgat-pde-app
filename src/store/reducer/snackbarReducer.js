import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'snackbarReducer',
  initialState: {
    isOpen: false,
    description: '',
    type: '',
    anchorEl: null
  },
  reducers: {
    showSnackbar(state, action) {
      state.isOpen = true;
      state.description = action.payload.description;
      state.type = action.payload.type;
      state.anchorEl = action.payload.anchorEl || null;
    },
    closeSnackbar(state, action) {
      state.isOpen = false;
      state.description = '';
      state.type = '';
      state.anchorEl = null;
    }
  }
});

export const { showSnackbar, closeSnackbar } = appSlice.actions;
export default appSlice.reducer;
