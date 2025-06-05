import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import ShippingLocationService from '@src/api/commonService/ShippingLocationService';
import { useOrgAccountSelectionContext } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';
import AuthUtils from '@src/util/AuthUtils';

const ShippingLocationContext = createContext();

export const useShippingLocation = () => {
  const context = useContext(ShippingLocationContext);
  if (!context) {
    throw new Error('useShippingLocation must be used within a ShippingLocationProvider.');
  }
  return context;
};

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: []
};

const INITIAL_SORT_STATE = {
  sortBy: 'id',
  sortOrder: 'desc'
};

const INITIAL_PAGINATION_CONFIG = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

export const ShippingLocationProvider = ({ children, accountId }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const practiceId = AuthUtils.getPracticeId();
  const organizationId = selectedOrganization?.id || practiceId;
  const [fileteredData, setfileteredData] = useState(false);
  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const requestParams = useMemo(
    () => ({
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy,
      sortOrder: sortConfig.sortOrder,
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(filterConfig?.status?.length && { status: [filterConfig.status] })
    }),
    [filterConfig, paginationConfig.pageNumber, sortConfig]
  );

  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ['ShippingLocations', requestParams, accountId, organizationId],
    queryFn: async () => {
      const result = await ShippingLocationService.getShippingLocationList(requestParams, accountId, organizationId);
      const { content: data, totalElements, totalPages } = result;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      return data;
    },
    enabled: !!accountId && !!organizationId,
    refetchOnWindowFocus: false
  });

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
    setfileteredData(false);
  };

  useEffect(() => {
    if (accountId && organizationId) {
      refetch();
    }
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, accountId, organizationId]);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig({ ...filters });
    setfileteredData(true);
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
      accountId,
      filterConfig,
      paginationConfig,
      setFilterConfig,
      clearFilters,
      applyFilters,
      applySort,
      setPageNumber,
      refreshData: refetch,
      fileteredData
    }),
    [updateFilterState, clearFilters, isLoading, isError, error, data, refetch, accountId, filterConfig, paginationConfig, fileteredData]
  );
  return <ShippingLocationContext.Provider value={ctxValue}>{children}</ShippingLocationContext.Provider>;
};
