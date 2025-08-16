import React, { createContext, useContext, useState, useEffect } from 'react';
import { CONTROL_OPTIONS } from '../pages/ApproverGroupDetail/RulesConfig';

const FormContext = createContext();

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

const defaultInitialValues = {
  name: '',
  rules: [{ attributeType: CONTROL_OPTIONS.Price, value: '' }],
  approverUsers: []
};

export const FormProvider = ({ children }) => {
  const [initialValues, setInitialValues] = useState(defaultInitialValues); // Use defaultInitialValues
  const [isEditMode, setIsEditMode] = useState(false);
  const [locationState, setLocationState] = useState(null);

  useEffect(() => {
    if (!isEditMode) {
      setInitialValues(defaultInitialValues); // Reset to default values
      setLocationState(null); // Clear location state as well
    }
  }, [isEditMode]);

  const initializeFormFromLocation = (grpId, locationData) => {
    if (locationData) {
      setIsEditMode(true);
      setLocationState(locationData);

      const { name, rules = {}, approverUsers = [] } = locationData;

      const transformedRules = [];
      const { price, accounts, therapies, roles, users } = rules;
      if (price != null) {
        transformedRules.push({
          attributeType: CONTROL_OPTIONS.Price,
          value: price
        });
      }
      if (accounts)
        transformedRules.push({
          attributeType: CONTROL_OPTIONS.Account,
          value: accounts.map((item) => ({
            label: item.accountName,
            value: item.accountId,
            channelType: item.channelType,
            name: item.accountName
          }))
        });
      if (therapies)
        transformedRules.push({
          attributeType: CONTROL_OPTIONS.Material,
          value: therapies.map((item) => ({
            label: item.tradeName,
            value: item.tradeName,
            channelType: item.channelType
          }))
        });
      if (roles) {
        transformedRules.push({
          attributeType: CONTROL_OPTIONS['User Role'],
          value: roles.map((item) => ({
            label: item.roleName,
            value: item.roleId,
            name: item.roleName
          }))
        });
      }
      if (users)
        transformedRules.push({
          attributeType: CONTROL_OPTIONS['User Name'],
          value: users.map((item) => ({
            label: item.userName,
            value: item.userId,
            name: item.userName
          }))
        });

      const transformedApproverUsers = approverUsers.map((user) => ({
        email: user.email,
        value: user.userId,
        label: user.userName
      }));

      setInitialValues({
        id: grpId,
        name: name || '',
        rules: (transformedRules || []).filter((transformedRules) => transformedRules && transformedRules.attributeType),
        approverUsers: transformedApproverUsers
      });
    }
  };

  return (
    <FormContext.Provider
      value={{
        initialValues,
        setInitialValues,
        isEditMode,
        setIsEditMode,
        locationState,
        setLocationState,
        initializeFormFromLocation
      }}>
      {children}
    </FormContext.Provider>
  );
};
