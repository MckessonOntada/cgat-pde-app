import React from 'react';

const WidgetContext = React.createContext(null);

export const WidgetProvider = ({ initialState = {}, children }) => {
  const [state, setState] = React.useState(initialState);

  const getValue = (key) => state[key];

  const setValue = (key, value) => {
    if (!state.hasOwn(key))
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

  return <WidgetContext.Provider value={{ getValue, setValue, resetValue }}>{children}</WidgetContext.Provider>;
};

export const useWidgetContext = () => {
  const context = React.useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgetContext must be used inside WidgetProvider');
  }
  return context;
};
