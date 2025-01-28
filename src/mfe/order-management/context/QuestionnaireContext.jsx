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

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: []
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: null
};

export const QuestionnaireProvider = (props) => {
  const [filterConfig, setFilterConfig] = React.useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = React.useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = React.useState(INITIAL_SORT_STATE);
  const [dataState, setDataState] = React.useState(INITIAL_DATA_STATE);
  const [bucket, setBucket] = React.useState(INITIAL_STATE);
  const selectEntity = () => {};
  const removeEntity = () => {};
  const contextValue = { bucket, selectEntity, removeEntity };

  return <QuestionnaireContext.Provider value={contextValue}>{props.children}</QuestionnaireContext.Provider>;
};
