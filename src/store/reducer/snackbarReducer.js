import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'snackbarReducer',
  initialState: {
    isOpen: false,
    description: '',
    type: ''
  },
  reducers: {
    showSnackbar(state, action) {
      state.isOpen = true;
      state.description = action.payload.description;
      state.type = action.payload.type;
    },
    closeSnackbar(state, action) {
      state.isOpen = false;
      state.description = '';
      state.type = '';
    }
  }
});

export const { showSnackbar, closeSnackbar } = appSlice.actions;
export default appSlice.reducer;
