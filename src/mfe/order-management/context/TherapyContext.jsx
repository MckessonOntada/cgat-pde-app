import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';

const TherapyContext = createContext();

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  salesOrg: [],
  customerInd: [] //Todo
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: null
};

const INITIAL_PAGINATION_CONFIG = {
  total: 0,
  pageSize: 8,
  pages: 0,
  pageNumber: 1
};

export const useTherapy = () => {
  const context = useContext(TherapyContext);
  if (!context) {
    throw new Error('useTherapy must be used within a Therapy Provider.');
  }
  return context;
};

export const TherapyProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);

  const requestParams = useMemo(
    () => ({
      pageNumber: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(filterConfig?.salesOrg && filterConfig?.salesOrg.length > 0 && { salesOrg: [...filterConfig.salesOrg] }),
      ...(filterConfig?.customerIdentifier && filterConfig?.customerIdentifier.length > 0 && { customerIdentifier: [...filterConfig.customerIdentifier] }),

      ...(sortConfig?.sortBy && { sortBy: sortConfig.sortBy }),
      ...(sortConfig?.sortOrder && { sortBy: sortConfig.sortOrder })
    }),
    [filterConfig, paginationConfig.pageNumber]
  );

  const userId = AuthUtils.getUserId();
  const updateFilterState = useCallback((field, value) => {
    setFilterConfig((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const {
    isLoading,
    isError,
    data = [],
    refetch: refreshData
  } = useQuery({
    queryKey: ['Therapy', requestParams],
    queryFn: async () => {
      const url = `${ApiRoutes.ORDER(userId)}/therapies?${serializeParams(requestParams)}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (res.data) {
        const { content: data, totalElements, totalPages } = res.data;

        setPaginationConfig((prevConfig) => ({
          ...prevConfig,
          ...(totalElements && { totalElements }),
          ...(totalPages && { totalPages })
        }));

        return data;
      }

      return [];
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    refreshData();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const applyFilters = (filters) => {
    setPageNumber(1);
    setFilterConfig({ ...filters });
  };

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const clearFilters = () => setFilterConfig(INITIAL_FILTER_STATE);

  const ctxValue = useMemo(
    () => ({
      data,
      isLoading,
      isError,
      filterConfig,
      paginationConfig,
      setPageNumber,
      applySort,
      applyFilters,
      clearFilters,
      refreshData
    }),
    [updateFilterState, clearFilters, isLoading, isError, data]
  );
  return <TherapyContext.Provider value={ctxValue}>{children}</TherapyContext.Provider>;
};
