import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';

const RECORDS_PER_PAGE = 8;

const AccountsContext = createContext();

export const useAccounts = () => {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error('useOrg must be used within a OrganizationProvider.');
  }
  return context;
};

const INITIAL_STATE = {
  searchQuery: '',
  status: null,
  salesOrg: null,
  distChannels: null
};

const INITIAL_SORT_PARAMS = {
  sortBy: 'name_1',
  sortOrder: 'asc'
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: RECORDS_PER_PAGE,
  totalPages: 0,
  pageNumber: 1
};

export const AccountsProvider = ({ children, practiceId, userId }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_STATE);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState(INITIAL_SORT_PARAMS);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);

  const updateFilterState = useCallback((field, value) => {
    setFilterConfig((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const clearFilters = () => {
    setFilterConfig(INITIAL_STATE);
    setPaginationConfig(INITIAL_PAGINATION_STATE);
  };

  useEffect(() => {
    clearFilters();
  }, [practiceId]);

  // use from context
  const apiUrl = useMemo(() => {
    let params = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortCriteria.sortBy,
      sortOrder: sortCriteria.sortOrder,
      ...(practiceId && { practiceId }),
      partnerFunction: 'SOLD_TO',
      ...(filterConfig.searchQuery && { query: filterConfig.searchQuery }),
      ...(filterConfig.status && { status: filterConfig.status }),
      ...(filterConfig.distChannels && {
        distChannels: filterConfig.distChannels
      }),
      ...(filterConfig.salesOrg && { salesOrg: filterConfig.salesOrg }),
      ...(practiceId && { channelType: 'ALL' })
    };

    if (userId) {
      return `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/users/${userId}/accounts?${serializeParams(params)}`;
    }
    return practiceId
      ? `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/accounts?${serializeParams(params)}`
      : `${ApiRoutes.PUBLIC_ACCOUNTS}?${serializeParams(params)}`;
  }, [filterConfig, paginationConfig, sortCriteria, practiceId]);

  // Fetch data from server
  const { isLoading, isFetching, data, isError, refetch } = useQuery({
    queryKey: [apiUrl],
    queryFn: async () => {
      const response = await HttpResourceService.callRest(`${apiUrl}`, httpVerb.GET, {});
      if (response) {
        const { content, totalElements, totalPages } = response.data;

        setPaginationConfig((prevConfig) => ({
          ...prevConfig,
          totalElements,
          totalPages
        }));

        return content;
      }
      return [];
    }
  });

  const applyFilters = useCallback((values) => {
    setFilterConfig(values);
  }, []);

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  useEffect(() => {
    refetch();
  }, [filterConfig, paginationConfig.pageNumber, sortCriteria]);

  const ctxValue = useMemo(
    () => ({
      data,
      filters: {
        ...filterConfig,
        update: {
          setSearchQuery: (value) => updateFilterState('searchQuery', value),
          updateQuery: updateFilterState
        }
      },
      paginationConfig,
      isLoading,
      isFetching,
      isError,
      refetch,
      setSortCriteria,
      setFilterConfig,
      clearFilters,
      setPageNumber,
      applyFilters,
      filterConfig
    }),
    [data, updateFilterState, clearFilters, currentPage, setPageNumber, isLoading, isError, filterConfig, paginationConfig, applyFilters, refetch, filterConfig]
  );

  return <AccountsContext.Provider value={ctxValue}>{children}</AccountsContext.Provider>;
};
