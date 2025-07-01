import CommonDataService from '@src/api/commonService/CommonDataService';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import React from 'react';
import { useDispatch } from 'react-redux';

const RECORDS_PER_PAGE = 8;

const OrgContext = createContext();

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useOrg must be used within an OrgProvider.');
  }
  return context;
};

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  location: [],
  status: []
};

const INITIAL_SORT_STATE = {
  sortBy: 'name',
  sortOrder: 'asc'
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: RECORDS_PER_PAGE,
  totalPages: 0,
  pageNumber: 1
};

export const OrgProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const dispatch = useDispatch();
  const requestParams = useMemo(
    () => ({
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy,
      sortOrder: sortConfig.sortOrder,
      ...(filterConfig.searchQuery && { query: filterConfig.searchQuery }),
      ...(filterConfig.location && { location: filterConfig.location }),
      ...(filterConfig.status && { status: filterConfig.status })
    }),
    [filterConfig, paginationConfig.pageNumber, sortConfig]
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['organizations', requestParams],
    queryFn: async () => {
      const response = await dispatch(CommonDataService.getOrganizationList(requestParams));

      if (response) {
        const { content, totalElements, totalPages } = response;

        setPaginationConfig((prevConfig) => ({
          ...prevConfig,
          ...(totalElements && { totalElements }),
          ...(totalPages && { totalPages })
        }));

        return content;
      }
      return [];
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    refetch();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const refreshData = () => refetch();

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
    }));
  };

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  const applySort = (newSortConfig) => setSortConfig(newSortConfig);

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const contextValue = {
    data: data || [],
    isLoading,
    isError,
    filterConfig,
    paginationConfig,
    sortConfig,
    refreshData,
    applyFilters,
    clearFilters,
    applySort,
    setPageNumber
  };

  return <OrgContext.Provider value={contextValue}>{children}</OrgContext.Provider>;
};
