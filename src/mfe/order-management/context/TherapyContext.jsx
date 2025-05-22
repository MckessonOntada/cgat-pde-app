import React from 'react';
import { useQuery } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';

const TherapyContext = React.createContext();

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  salesOrg: [],
  customerInd: [] //Todo
};

const INITIAL_SORT_STATE = {
  sortBy: 'material_Number',
  sortOrder: 'desc'
};

const INITIAL_PAGINATION_CONFIG = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

export const useTherapy = () => {
  const context = React.useContext(TherapyContext);
  if (!context) {
    throw new Error('useTherapy must be used within a Therapy Provider.');
  }
  return context;
};

export const TherapyProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = React.useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = React.useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = React.useState(INITIAL_SORT_STATE);

  const requestParams = React.useMemo(
    () => ({
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(filterConfig?.salesOrg && filterConfig?.salesOrg.length > 0 && { salesOrg: [...filterConfig.salesOrg] }),
      ...(filterConfig?.customerIdentifier && filterConfig?.customerIdentifier.length > 0 && { customerIdentifier: [...filterConfig.customerIdentifier] }),

      ...(sortConfig?.sortBy && { sortBy: sortConfig.sortBy }),
      ...(sortConfig?.sortOrder && { sortOrder: sortConfig.sortOrder })
    }),
    [filterConfig, paginationConfig.pageNumber, sortConfig]
  );

  const updateFilterState = React.useCallback((field, value) => {
    setFilterConfig((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const {
    isFetching,
    error,
    data = {},
    refetch: refreshData
  } = useQuery({
    queryKey: ['Therapy', requestParams],
    queryFn: async () => OrderService.getTherapies(requestParams),
    onSuccess: (result) => {
      const { totalElements, totalPages } = result;

      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
    },
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    refreshData();
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

  const clearFilters = () => setFilterConfig(INITIAL_FILTER_STATE);

  const ctxValue = React.useMemo(
    () => ({
      data: data.content || [],
      isFetching,
      error,
      filterConfig,
      paginationConfig,
      setPageNumber,
      applySort,
      applyFilters,
      clearFilters,
      refreshData
    }),
    [updateFilterState, clearFilters, isFetching, error, data]
  );
  return <TherapyContext.Provider value={ctxValue}>{children}</TherapyContext.Provider>;
};
