import { createSlice } from '@reduxjs/toolkit';
const appSlice = createSlice({
  name: 'appReducer',
  initialState: {
    systemError: {
      isVisible: false,
      errorObject: null
    },
    pageTitleKey: '',
    isScrolled: false,
    organizationList: [],
    organizationListOptions: []
  },
  reducers: {
    setPageTitleKey(state, action) {
      state.pageTitleKey = action?.payload;
    },
    setIsScrolled(state, action) {
      state.isScrolled = action.payload;
    },
    updateOrganizationList(state, action) {
      state.organizationList = action.payload;
    },
    updateOrganizationListOptions(state, action) {
      state.organizationListOptions = action.payload.content.map((i) => ({ label: i.name, value: i.id, isChecked: false }));
    }
  }
});

export const { setPageTitleKey, setIsScrolled, updateOrganizationList, updateOrganizationListOptions } = appSlice.actions;
export default appSlice.reducer;
