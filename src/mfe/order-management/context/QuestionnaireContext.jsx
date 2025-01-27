import React from 'react';
const QuestionnaireContext = React.createContext('Questionnaire Context');

export const useQuestionnaire = () => {
  const context = React.useContext(QuestionnaireContext);
  if (!context) {
    throw new Error(
      'QuestionnaireContext can be only used inside QuestionnaireContextProvider. Please make sure parent component is wrapped within provider.'
    );
  }
  return context;
};

const INITIAL_STATE = {
  bucket: []
};

export const QuestionnaireProvider = (props) => {
  const [bucket, setBucket] = React.useState(INITIAL_STATE);
  const selectEntity = () => {};
  const removeEntity = () => {};
  const contextValue = { bucket, selectEntity, removeEntity };

  return <QuestionnaireContext.Provider value={contextValue}>{props.children}</QuestionnaireContext.Provider>;
};
