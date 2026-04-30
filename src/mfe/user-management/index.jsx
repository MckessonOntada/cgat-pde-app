import React from 'react';
import { Routes } from './routes';
import { WidgetProvider } from '@src/context/WidgetContext';

const INITIAL_STATE = {
  selectedRole: '',
  isLoading: true,
  userDetails: null,
  reloadUser: false,
  createWizardSteps: {
    personalDetails: false,
    rolePermissions: false,
    accountsSelection: false,
    materialSelection: false
  }
};
const UserManagement = () => {
  return (
    <WidgetProvider initialState={INITIAL_STATE}>
      <Routes />
    </WidgetProvider>
  );
};

export default UserManagement;
