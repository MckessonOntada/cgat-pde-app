import React from 'react';

const QuestionnaireModuleContext = React.createContext('Questionnaire module common state context');

export const useQuestionnaireModule = () => {
  const context = React.useContext(QuestionnaireModuleContext);
  if (!context) throw Error('No such a provider found');
};

export const QuestionnaireModuleProvider = ({ children }) => {
  const [selectedTemplates, setSelectedTemplates] = React.useState([]);
  const setTemplates = (templates) => {
    setSelectedTemplates(templates);
  };
  const contextValue = {
    selectedTemplates,
    setTemplates
  };
  return <QuestionnaireModuleContext.Provider value={contextValue}>{children}</QuestionnaireModuleContext.Provider>;
};
