import ApiRoutes from '@src/api/ApiRoutes';
import QuestionnaireConfig from '@src/api/commonService/QuestionnaireService';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
const QuestionnaireContext = createContext('Questionnaire Context');

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
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

export const QuestionnaireProvider = ({ children }) => {
  const [bucket, setBucket] = useState(INITIAL_STATE);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const selectEntity = () => {};
  const removeEntity = () => {};

  const contextValue = { bucket, selectEntity, removeEntity }; 
  const requestParams = useMemo(() => {
    const baseParams = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(sortConfig?.sortBy && { sortBy: sortConfig.sortBy }),
      ...(sortConfig?.sortOrder && { sortOrder: sortConfig.sortOrder })
    };

    return baseParams;
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const {
    isLoading: isLoadingTemplates,
    isError: isErrorTemplates,
    data: TemplatesData,
    refetch: refetchTemplates
  } = useQuery({
    queryKey: ['Templates', requestParams],
    queryFn: async () => QuestionnaireConfig.getQuestionnaires(requestParams),
    onSuccess: (result) => {
      const { totalElements, totalPages, content :data } = result;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
     return data;
    } ,
    refetchOnWindowFocus: false
  });
 
  useEffect(() => {
    refetchTemplates();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig({ ...filters });
  };
  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };
  const clearFilters = () => {
    setFilterConfig({ ...INITIAL_FILTER_STATE });
  };

  const setCurrentPage = (pageNumber) => {
    setPaginationConfig((prevState) => ({ ...prevState, pageNumber: pageNumber }));
  };

  const setTemplates= (templates) => { setSelectedTemplates(templates); };

  return (
    <QuestionnaireContext.Provider
      value={{
        filterConfig,
        paginationConfig,
        applyFilters,
        clearFilters,
        setCurrentPage,setPageNumber,
        applySort,
        data: TemplatesData?.content,
        refetchTemplates,
        isLoading: isLoadingTemplates,
        isError: isErrorTemplates,
        setTemplates,
        selectedTemplates,
        setSelectedTemplates
      }}>
      {children}
    </QuestionnaireContext.Provider>
  );

  // return <QuestionnaireContext.Provider value={contextValue}>{props.children}</QuestionnaireContext.Provider>;
};