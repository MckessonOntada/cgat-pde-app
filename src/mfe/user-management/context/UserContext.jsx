import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider.');
  }
  return context;
};

const INITIAL_FILTER_STATE = {
  searchQuery: "",
  status: [],
  role: []
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: null,
}

const INITIAL_PAGINATION_CONFIG = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1,
};

export const UserProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE)
  const [activeTab, setActiveTab] = useState('ACTIVE USERS');

  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const clearFilters = () => setFilterConfig(INITIAL_FILTER_STATE);

  // Use from context
  const requestParams = useMemo(
    () => {
      const params = {
        pageNo: paginationConfig.pageNumber - 1,
        pageSize: paginationConfig.pageSize,
        sortBy: sortConfig.sortBy || "first_name",
        sortOrder: sortConfig.sortOrder || "asc",
        userType: AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL'
      }

      if (filterConfig.searchQuery) params.query = filterConfig.searchQuery;
      if (filterConfig.status && filterConfig.status.length > 0) params.status = filterConfig.status;
      if (filterConfig.role && filterConfig.role.length > 0) params.role = filterConfig.role;

      return params;
    },
    [filterConfig, paginationConfig.pageNumber, sortConfig]
  );

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ['users', activeTab],
    queryFn: async () => {
      const url = activeTab === 'ACTIVE USERS' ? `${ApiRoutes.USERS()}?${serializeParams(requestParams)}` : `${ApiRoutes.USERS_PROVISIONING()}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (res.data) {
        const { content: data, totalElements, totalPages } = res.data;

        setPaginationConfig((prevConfig) => ({
          ...prevConfig,
          totalElements,
          totalPages,
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
  }

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig })

  const applyFilters = (filters) => {
    setPageNumber(1);
    setFilterConfig(prevFilters => ({
      ...prevFilters,
      ...filters
    }));
  }

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber,
    }));
  };

  const ctxValue = useMemo(
    () => ({
      data: data || [],
      isLoading,
      isError,
      filterConfig,
      paginationConfig,
      setFilterConfig,
      clearFilters,
      applyFilters,
      applySort,
      setPageNumber,
      activeTab,
      setActiveTab,
      refreshData
    }),
    [updateFilterState, clearFilters, isLoading, isError, data, activeTab, setActiveTab, refetch]
  );
  return <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>;
};
