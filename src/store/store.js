import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducer/appReducer';
import modalReducer from './reducer/modalReducer';
import snackbarReducer from './reducer/snackbarReducer';
import userReducer from './reducer/userReducer';
import alertReducer from './reducer/alertReducer';

const store = configureStore({
  reducer: {
    appState: appReducer,
    modalState: modalReducer,
    snackbarState: snackbarReducer,
    userState: userReducer,
    alertState: alertReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // Disable serializableCheck for non-serializable actions
    }).concat() // Add the API slice middleware
});

export default store;
