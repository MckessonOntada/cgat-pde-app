import React, { createContext, useContext, useMemo, useState } from 'react';
import { PaymentInvoicesData } from '../mockData/PaymentInvoicesData';
import { useDispatch } from 'react-redux';

const PaymentsInvoicesContext = createContext();

export const usePaymentInvoices = () => {
  const context = useContext(PaymentsInvoicesContext);
  if (!context) {
    throw new Error('usePaymentInvoices must be used within a PaymentsInvoiceProvider.');
  }
  return context;
};

const RECORDS_PER_PAGE = 8;

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

export const PaymentsInvoiceProvider = ({ children }) => {
  const [paymentHistoryData, setPaymentHistoryData] = useState(PaymentInvoicesData);
  const [data, setData] = useState(PaymentInvoicesData);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const dispatch = useDispatch();

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
    }));
  };

  const clearFilters = () => setFilterConfig(INITIAL_FILTER_STATE);

  const applySort = (newSortConfig) => setSortConfig(newSortConfig);

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const contextValue = {
    data: data || [],
    // isLoading,
    // isError,
    filterConfig,
    paginationConfig,
    sortConfig,
    // refreshData,
    applyFilters,
    clearFilters,
    applySort,
    setPageNumber
  };
  return <PaymentsInvoicesContext.Provider value={contextValue}>{children}</PaymentsInvoicesContext.Provider>;
};
