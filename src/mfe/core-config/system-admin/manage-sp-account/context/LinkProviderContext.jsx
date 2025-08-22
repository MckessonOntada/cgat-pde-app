import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import LinkProviderService from '@src/api/commonService/LinkProviderService';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

const LinkProviderContext = createContext();

export const useLinkProvider = () => {
  const context = useContext(LinkProviderContext);
  if (!context) {
    throw new Error('useLinkProvider must be used within a LinkProviderProvider.');
  }
  return context;
};

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: []
};

const INITIAL_SORT_STATE = {
  sortBy: 'first_name',
  sortOrder: 'desc'
};

const INITIAL_PAGINATION_CONFIG = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

export const LinkProviderProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [searchParams] = useSearchParams();
  const selectedOrganization = searchParams.get('orgId');
  const { spAccountId } = useParams();
  const location = useLocation();
  const isAddLinkProvider = useMemo(() => {
    return location.pathname.includes('link-provider');
  }, [location.pathname]);

  const requestParams = useMemo(
    () => ({
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy,
      sortOrder: sortConfig.sortOrder,
      ...(!isAddLinkProvider && { accountId: spAccountId }),
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(filterConfig?.status?.length && { status: [filterConfig.status] })
    }),
    [filterConfig, paginationConfig.pageNumber, sortConfig]
  );
  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ['LinkProviders', requestParams, selectedOrganization],
    queryFn: async () => {
      let result;
      if (isAddLinkProvider) {
        result = await LinkProviderService.getProviderList(requestParams, selectedOrganization, spAccountId);
      } else {
        result = await LinkProviderService.getProviderListByAccount(requestParams, selectedOrganization);
      }
      const { content: data, totalElements, totalPages } = result;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        totalElements,
        totalPages
      }));
      return data;
    },

    refetchOnWindowFocus: false
  });

  useEffect(() => {
    refetch();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
  };
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

  const ctxValue = useMemo(
    () => ({
      data: data || [],
      isLoading,
      isError,
      error,
      filterConfig,
      paginationConfig,
      setFilterConfig,
      clearFilters,
      applyFilters,
      applySort,
      setPageNumber,
      refreshData: refetch,
      isAddLinkProvider
    }),
    [updateFilterState, clearFilters, isLoading, isError, data, refetch]
  );
  return <LinkProviderContext.Provider value={ctxValue}>{children}</LinkProviderContext.Provider>;
};
