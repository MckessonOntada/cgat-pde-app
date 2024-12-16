import React, { createContext, useContext, useState, useEffect } from 'react';

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

  return (
    <FormContext.Provider
      value={{
        initialValues,
        setInitialValues,
        isEditMode,
        setIsEditMode,
        locationState,
        setLocationState
      }}>
      {children}
    </FormContext.Provider>
  );
};
