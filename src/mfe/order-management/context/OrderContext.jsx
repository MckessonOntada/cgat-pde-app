import OrderService from '@src/api/commonService/OrderService';
import React, { createContext, useContext, useState } from 'react';
import { MdViewArray } from 'react-icons/md';
import { useQuery } from 'react-query';

const TAB_VARIANT = {
  PENDING_SUBMISSION: 'pending submission',
  SUBMITTED: 'submitted'
};
const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: []
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: null
};

const INITIAL_DATA_STATE = [];

const OrderContext = createContext();

export const useOrders = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = React.useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = React.useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = React.useState(INITIAL_SORT_STATE);
  const [dataState, setDataState] = React.useState(INITIAL_DATA_STATE);
  const [tabVariant, setTabVariant] = React.useState(TAB_VARIANT.PENDING_SUBMISSION);

  const requestParams = React.useMemo(() => {
    const params = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy || 'createdAt',
      sortOrder: sortConfig.sortOrder || 'desc'
    };

    if (filterConfig.searchQuery) params.query = filterConfig.searchQuery;
    if (tabVariant === 'submitted') {
      params.status = 'submitted';
    } else {
      const allStatus = ['in_draft', 'approval_pending'];
      if (filterConfig.status && filterConfig.status != 'all') {
        params.status = filterConfig.status;
      } else {
        params.status = allStatus;
      }
    }
    return params;
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, tabVariant]);

  const {
    isFetching,
    refetch: refreshData,
    error
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => OrderService.getOrders(requestParams),
    onSuccess: (result) => {
      const { totalElements, totalPages } = result;
      setPaginationConfig((prevState) => ({ ...prevState, totalElements, totalPages }));

      if (result.content) {
        setDataState(result.content);
      }
    }
  });

  React.useEffect(() => {
    refreshData();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, tabVariant]);

  const applyFilters = (filters) => {
    setFilterConfig((prevFilters) => ({ ...prevFilters, ...filters }));
  };

  const clearFilters = () => {
    setFilterConfig({ ...INITIAL_FILTER_STATE });
  };

  const setCurrentPage = (pageNumber) => {
    setPaginationConfig((prevState) => ({ ...prevState, pageNumber: pageNumber }));
  };

  const changeTab = (tabType = '') => {
    setCurrentPage(1);
    if (tabType.toLowerCase() === 'submitted') setTabVariant('submitted');
    else {
      setTabVariant('pending_submission');
    }
  };

  return (
    <OrderContext.Provider
      value={{
        filterConfig,
        paginationConfig,
        dataState,
        isFetching,
        error,
        applyFilters,
        clearFilters,
        setCurrentPage,
        changeTab
      }}>
      {children}
    </OrderContext.Provider>
  );
};
