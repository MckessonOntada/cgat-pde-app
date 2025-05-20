import React, {
  createContext,
  useContext,
  useReducer,
  useCallback
} from 'react';

const initialState = {};

const ACTIONS = {
  SET_VALUE: 'SET_VALUE',
  RESET: 'RESET',
  REMOVE: 'REMOVE'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_VALUE:
      return {
        ...state,
        [action.key]: action.value
      };
    case ACTIONS.REMOVE:
      const { [action.key]: _, ...newState } = state;
      return newState;
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
};

const GenericContext = createContext(null);

export const GenericProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setValue = useCallback((key, value) => {
    dispatch({ type: ACTIONS.SET_VALUE, key, value });
  }, []);

  const removeKey = useCallback((key) => {
    dispatch({ type: ACTIONS.REMOVE, key });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET });
  }, []);

  return (
    <GenericContext.Provider value={{ state, setValue, removeKey, reset }}>
      {children}
    </GenericContext.Provider>
  );
};

export const useGenericContext = () => {
  const context = useContext(GenericContext);
  if (!context) {
    throw new Error('useGenericContext must be used within a GenericProvider');
  }
  return context;
};
