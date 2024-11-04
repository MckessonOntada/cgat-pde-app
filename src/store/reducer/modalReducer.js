import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modalReducer',
  initialState: {
    isOpen: false,
    title: '',
    body: null,
    footer: null,
    onClose: () => {}
  },
  reducers: {
    openModal(state, action) {
      state.isOpen = true;
      state.title = action.payload.title;
      state.body = action.payload.body;
      state.footer = action.payload.footer;
      state.onClose = action.payload.onClose || (() => {});
    },
    closeModal(state) {
      state.isOpen = false;
      // Call the onClose callback if provided
      if (state.onClose) {
        state.onClose();
      }
    }
  }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
