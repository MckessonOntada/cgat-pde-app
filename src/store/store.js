import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducer/appReducer';
import modalReducer from './reducer/modalReducer';
import snackbarReducer from './reducer/snackbarReducer';
import userReducer from './reducer/userReducer';

const store = configureStore({
  reducer: {
    appState: appReducer,
    modalState: modalReducer,
    snackbarState: snackbarReducer,
    userState: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
