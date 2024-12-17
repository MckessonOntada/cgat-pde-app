import React from 'react';
import { useParams } from 'react-router-dom';

const ManageOrderContext = React.createContext('Mange order context');

export const useManageOrder = () => {
  const context = React.useContext(ManageOrderContext);
  if (!context) {
    throw new Error(
      'useManageOrder can be only used inside ManageOrderProvider. Please make sure parent component is wrapped within provider.'
    );
  }

  return context;
};

const INITIAL_STATE = {
  mode: null,
  activeRecord: null
};

const INITIAL_MESSAGE_STATE = {
  messageKind: null,
  primaryMessage: null,
  secondaryMessage: null
};

export const ManageOrderProvider = (props) => {
  const [formState, setFormState] = React.useState(INITIAL_STATE);
  const [messageConfig, setMessageConfig] = React.useState(INITIAL_MESSAGE_STATE);

  const setMode = (mode) => {
    setFormState((prevState) => ({
      ...prevState,
      mode
    }));
  };

  const setActiveRecord = (activeRecord) => {
    setFormState((prevState) => ({
      ...prevState,
      activeRecord
    }));
  };

  const setMessage = (message) => {
    setMessageConfig({ ...message });
  };

  const clearMessage = () => {
    setMessageConfig(INITIAL_MESSAGE_STATE);
  };

  const contextValue = {
    formState,
    messageConfig,
    setMode,
    setActiveRecord,
    setMessage,
    clearMessage
  };

  return <ManageOrderContext.Provider value={contextValue}>{props.children}</ManageOrderContext.Provider>;
};
