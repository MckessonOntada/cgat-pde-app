import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import spMaterialData from '../mockData/SPMaterialData';

const SPMaterialContext = createContext();

export const useSPMaterial = () => {
  const context = useContext(SPMaterialContext);
  if (!context) {
    throw new Error('useSPMaterial must be used within a SPMaterialProvider.');
  }
  return context;
};

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: []
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: null
};

const INITIAL_PAGINATION_CONFIG = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

export const SPMaterialProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);

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
    queryKey: ['SPMaterials', requestParams],
    queryFn: async () => {
      // const url = '';
      // const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      // if (res.data) {
      // const { content: data, totalElements, totalPages } = res.data;

      // setPaginationConfig((prevConfig) => ({
      //   ...prevConfig,
      //   ...(totalElements && { totalElements }),
      //   ...(totalPages && { totalPages })
      // }));

      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        totalElements: spMaterialData.length,
        totalPages: 1
      }));
      return spMaterialData;
      ///  }

      // return [];
    },
    refetchOnWindowFocus: false
  });

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  useEffect(() => {
    refetch();
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
      refreshData: refetch
    }),
    [updateFilterState, clearFilters, isLoading, isError, data, refetch]
  );
  return <SPMaterialContext.Provider value={ctxValue}>{children}</SPMaterialContext.Provider>;
};
