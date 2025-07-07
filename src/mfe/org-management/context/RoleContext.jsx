import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '../../../api/HttpResourceService';
import ApiRoutes from '../../../api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import { DateUtils } from '@src/util/DateUtil';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider.');
  }
  return context;
};

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  dateRange: [],
  status: []
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: null
};

const INITIAL_MESSAGE_STATE = {
  messageKind: null,
  primaryMessage: null,
  secondaryMessage: null
};

const INITIAL_PAGINATION_CONFIG = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

export const RoleProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [messageConfig, setMessageConfig] = useState(INITIAL_MESSAGE_STATE);

  const requestParams = useMemo(() => {
    const params = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy || 'name',
      sortOrder: sortConfig.sortOrder || 'asc'
    };

    if (filterConfig.searchQuery) params.query = filterConfig.searchQuery;
    if (filterConfig.status) params.status = filterConfig.status;
    if (filterConfig.dateRange?.[0]) params.startDate = DateUtils.formatDate(filterConfig.dateRange[0], 'dd/mm/yyyy');
    if (filterConfig.dateRange?.[1]) params.endDate = DateUtils.formatDate(filterConfig.dateRange[1], 'dd/mm/yyyy');

    return params;
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['roles', requestParams],
    queryFn: async () => {
      const response = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLES()}?${serializeParams(requestParams)}`, httpVerb.GET, {});
      if (response.data) {
        const { content: data, totalElements, totalPages } = response.data;

        setPaginationConfig((prevConfig) => ({
          ...prevConfig,
          totalElements,
          totalPages
        }));

        return data;
      }
      return [];
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    refetch();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const refreshData = () => {
    refetch();
  };

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const applyFilters = (filters) => {
    setPageNumber(1);
    setFilterConfig({ ...filters });
  };

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const setMessage = (message) => {
    setMessageConfig({ ...message });
  };

  const clearMessage = () => {
    setMessageConfig(INITIAL_MESSAGE_STATE);
  };

  const contextValue = {
    data: data || [],
    isLoading,
    isFetching,
    isError,
    error,
    filterConfig,
    paginationConfig,
    messageConfig,
    refreshData,
    setFilterConfig,
    clearFilters,
    applyFilters,
    applySort,
    setPageNumber,
    setMessage,
    clearMessage
  };

  return <RoleContext.Provider value={contextValue}>{children}</RoleContext.Provider>;
};
