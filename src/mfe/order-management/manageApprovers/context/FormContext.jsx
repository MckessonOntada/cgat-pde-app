import React, { createContext, useContext, useState, useEffect } from 'react';
import { RuleKeys, RuleLabels, RuleValueKeys } from '../pages/ApproverGroupDetail/RulesConfig';

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
  rules: [{ attributeType: 'Price', value: '' }],
  approverUsers: [],
  attributeuseroption: 'user_role'
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

      const transformedRules = Object.entries(rules).map(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return null;
        }
        if (key === RuleKeys.PRICE) {
          return { attributeType: RuleLabels[key], value };
        }

        if ([RuleKeys.ACCOUNTS, RuleKeys.THERAPIES, RuleKeys.USERS, RuleKeys.ROLES].includes(key)) {
          const valueKey = RuleValueKeys[key];
          if (key === RuleKeys.USERS && rules[RuleKeys.ROLES]?.length > 0) return null;
          if (key === RuleKeys.ROLES && rules[RuleKeys.USERS]?.length > 0) return null;

          return {
            attributeType: RuleLabels[key],
            value: value.map((item) => item[valueKey])
          };
        }
      });
      const hasRoles = rules.roles && rules.roles.length > 0;
      const hasUsers = rules.users && rules.users.length > 0;

      const dynamicAttributeUserOption = hasRoles ? 'user_role' : hasUsers ? 'user_name' : 'user_role';
      const transformedApproverUsers = approverUsers.map((user) => user.userId);

      setInitialValues({
        id: grpId,
        name: name || '',
        rules: (transformedRules || []).filter((transformedRules) => transformedRules && transformedRules.attributeType),
        approverUsers: transformedApproverUsers,
        attributeuseroption: dynamicAttributeUserOption
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
