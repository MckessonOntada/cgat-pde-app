import React from 'react';

const WidgetContext = React.createContext(null);

export const WidgetProvider = ({ initialState = {}, children }) => {
  const [state, setState] = React.useState(initialState);

  const setValue = (key, value) => {
    if (!Object.hasOwn(state, key))
      throw new Error(`WidgetContext Error: Cannot set value for unknown key "${key}". Allowed keys: ${Object.keys(initialState).join(', ')}`);

    setState((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const resetValue = (key) => {
    setState((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const reset = () => setState(initialState);

  return <WidgetContext.Provider value={{ state, setValue, reset, resetValue }}>{children}</WidgetContext.Provider>;
};

export const useWidgetContext = () => {
  const context = React.useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgetContext must be used inside WidgetProvider');
  }
  return context;
};
