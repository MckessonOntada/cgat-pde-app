import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'userReducer',
  initialState: {
    user: null
  },
  reducers: {
    setUserData(state, action) {
      state.user = action.payload;
    }
  }
});

export const { setUserData } = appSlice.actions;
export default appSlice.reducer;
