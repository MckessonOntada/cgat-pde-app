import { createSlice } from '@reduxjs/toolkit';
const appSlice = createSlice({
  name: 'appReducer',
  initialState: {
    systemError: {
      isVisible: false,
      errorObject: null
    },
    pageTitleKey: '',
    isScrolled: false
  },
  reducers: {
    showSystemError(state, action) {
      state.systemError.isVisible = true;
    },
    setPageTitleKey(state, action) {
      state.pageTitleKey = action?.payload;
    },
    setIsScrolled(state, action) {
      state.isScrolled = action.payload;
    }
  }
});

export const { showSystemError, setPageTitleKey, setIsScrolled } = appSlice.actions;
export default appSlice.reducer;
