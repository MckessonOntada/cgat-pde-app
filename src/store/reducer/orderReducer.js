import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  hasUnsavedChanges: false
};

const orderSlice = createSlice({
  name: 'orderSlice',
  initialState: INITIAL_STATE,
  reducers: {
    hasUnsavedChanges: (state, action) => {
      state.hasUnsavedChanges = action.payload || false;
    }
  }
});

export const { hasUnsavedChanges } = orderSlice.actions;
export default orderSlice.reducer;
