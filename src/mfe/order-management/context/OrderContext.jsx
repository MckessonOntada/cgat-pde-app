import OrderService from '@src/api/commonService/OrderService';
import React, { createContext, useContext, useState } from 'react';
import { useQuery } from 'react-query';

const TAB_VARIANT = {
  PENDING_SUBMISSION: 'pending submission',
  SUBMITTED: 'submitted'
};
const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: []
};

const INITIAL_PAGINATION_CONFIG = {
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
  const [filterState, setFilterState] = React.useState(INITIAL_FILTER_STATE);
  const [pageConfig, setPageConfig] = React.useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = React.useState(INITIAL_SORT_STATE);
  const [dataState, setDataState] = React.useState(INITIAL_DATA_STATE);
  const [tabVariant, setTabVariant] = React.useState(TAB_VARIANT.PENDING_SUBMISSION);

  const { isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => OrderService.getOrders(),
    onSuccess: (result) => {
      if (result.content) {
        setDataState(result.content);
      }
    }
  });

  const changeTabVariant = (newVariant) => {};

  const applyFilters = (filters) => {
    setFilterState((prevFilters) => ({ ...prevFilters, ...filters }));
  };

  const clearFilters = () => {
    setFilterState({ ...initialFilterState });
  };

  const setCurrentPage = (page) => {
    _setPageConfig((prevState) => ({ ...prevState, currentPage: page }));
  };

  return (
    <OrderContext.Provider
      value={{
        filterState,
        pageConfig,
        dataState,
        applyFilters,
        clearFilters,
        setCurrentPage
      }}>
      {children}
    </OrderContext.Provider>
  );
};
