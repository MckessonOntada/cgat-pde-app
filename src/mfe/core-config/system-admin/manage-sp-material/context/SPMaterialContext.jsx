import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import MaterialService from '@src/api/commonService/MaterialService';
import ServiceUtil from '@src/api/commonService/ServiceUtil';

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
  status: 'ALL'
};

const INITIAL_SORT_STATE = {
  sortBy: 'trade_name',
  sortOrder: 'desc'
};

const INITIAL_PAGINATION_CONFIG = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

export const SPMaterialProvider = ({ children, isLinkCatalog = false }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [selectedSPMaterial, setSelectedSPMaterial] = useState([]);
  const [fileteredData, setfileteredData] = useState(false);
  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const requestParams = useMemo(() => {
    const statusFilter = filterConfig?.status;

    const statusParam = isLinkCatalog ? 'ACTIVE' : !statusFilter || statusFilter === 'all' ? 'ALL' : [statusFilter];

    return {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy || 'trade_name',
      sortOrder: sortConfig.sortOrder || 'desc',
      channelTypes: 'SPECIALITY_PHARMA',
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(statusParam && { status: statusParam }),
      ...(filterConfig.manufacturer && { manufacturer: filterConfig.manufacturer })
    };
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ['SPMaterials', requestParams],
    queryFn: async () => {
      const result = await MaterialService.getSPMaterial(requestParams);
      const { content: data, totalElements, totalPages } = result;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      return data;
    },

    refetchOnWindowFocus: false
  });

  const clearFilters = () => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig(INITIAL_FILTER_STATE);
    setfileteredData(false);
  };

  useEffect(() => {
    refetch();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

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
      filterConfig,
      paginationConfig,
      setFilterConfig,
      clearFilters,
      applyFilters,
      applySort,
      setPageNumber,
      refreshData: refetch,
      selectedSPMaterial,
      setSelectedSPMaterial,
      fileteredData
    }),
    [updateFilterState, clearFilters, isLoading, isError, data, refetch]
  );
  return <SPMaterialContext.Provider value={ctxValue}>{children}</SPMaterialContext.Provider>;
};
