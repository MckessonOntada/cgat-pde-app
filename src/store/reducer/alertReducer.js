import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'alertReducer',
  initialState: {
    isOpen: false,
    description: '',
    type: '',
    anchorEl: null
  },
  reducers: {
    showAlert(state, action) {
      state.isOpen = true;
      state.description = action.payload.description;
      state.type = action.payload.type;
      state.anchorEl = action.payload.anchorEl;
    },
    closeAlert(state, action) {
      state.isOpen = false;
      state.description = '';
      state.type = '';
      state.anchorEl = null;
    }
  }
});

export const { showAlert, closeAlert } = appSlice.actions;
export default appSlice.reducer;
