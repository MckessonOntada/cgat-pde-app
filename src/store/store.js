import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducer/appReducer';
import modalReducer from './reducer/modalReducer';
import snackbarReducer from './reducer/snackbarReducer';
import userReducer from './reducer/userReducer';
import { OrganizationApi } from '../../src/mfe/org-management/slices/Organization';

const store = configureStore({
  reducer: {
    appState: appReducer,
    modalState: modalReducer,
    snackbarState: snackbarReducer,
    userState: userReducer,
    [OrganizationApi.reducerPath]: OrganizationApi.reducer // The reducer for the organization API slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // Disable serializableCheck for non-serializable actions
    }).concat(OrganizationApi.middleware) // Add the API slice middleware
});

export default store;
