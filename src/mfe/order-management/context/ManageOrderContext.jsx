import OrderService from '@src/api/commonService/OrderService';
import React from 'react';
import { useQuery } from 'react-query';
import { ORDER_MODE, ORDER_STAGES } from '../routes/constants';
import CommonUtils from '@src/util/CommonUtils';

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
  mode: ORDER_MODE.CREATE,
  currentStage: ORDER_STAGES.THERAPY_SELECTION,
  activeRecord: null
};

const INITIAL_MESSAGE_STATE = {
  messageKind: null,
  primaryMessage: null,
  secondaryMessage: null
};

export const ManageOrderProvider = (props) => {
  const [formState, setFormState] = React.useState(INITIAL_STATE);
  const [activeOrderId, setActiveOrderId] = React.useState(null);
  const [messageConfig, setMessageConfig] = React.useState(INITIAL_MESSAGE_STATE);

  const { isFetching, refetch: refreshData } = useQuery({
    queryKey: ['summary', activeOrderId],
    queryFn: async () => OrderService.getOrderById(activeOrderId),
    onSuccess: (result) => {
      setFormState((prevState) => ({
        ...prevState,
        activeRecord: {
          ...result
        }
      }));
    },
    enabled: !!activeOrderId
  });

  React.useEffect(() => {
    if (activeOrderId && !CommonUtils.isNonEmptyObject(formState.activeRecord)) {
      refreshData();
    }
  }, [activeOrderId]);

  const setMode = (mode) => {
    setFormState((prevState) => ({
      ...prevState,
      mode
    }));
  };

  const editByStage = (stage) => {
    setFormState((prevState) => ({
      ...prevState,
      mode: ORDER_MODE.EDIT,
      activeRecord: {
        ...prevState.activeRecord,
        currentStage: Object.keys(ORDER_STAGES)[stage]
      }
    }));
  };

  const setActiveRecord = (activeRecord) => {
    const { id, currentStage, orderStage } = activeRecord;
    setActiveOrderId(id);
    setFormState((prevState) => ({
      ...prevState,
      currentStage: ORDER_STAGES[currentStage],
      activeRecord
    }));
  };

  const resetActiveRecord = () => {
    setFormState(INITIAL_STATE);
    setActiveOrderId(null);
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
    isFetching,
    setActiveRecord,
    resetActiveRecord,
    setCurrentOrder: setActiveOrderId,
    editByStage,
    setMessage,
    clearMessage
  };

  return <ManageOrderContext.Provider value={contextValue}>{props.children}</ManageOrderContext.Provider>;
};
