import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PaymentHistoryData } from '../mockData/PaymentHistoryData';
import { useDispatch } from 'react-redux';

const PaymentHistoryContext = createContext();

export const usePaymentHistory = () => {
  const context = useContext(PaymentHistoryContext);
  if (!context) {
    throw new Error('usePaymentHistory must be used within a PaymentInvoiceProvider.');
  }
  return context;
};
const RECORDS_PER_PAGE = 8;

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  paymentMethod: [],
  paymentStatus: []
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

export const PaymentHistoryProvider = ({ children }) => {
  const [paymentHistoryData, setPaymentHistoryData] = useState(PaymentHistoryData);
  const [data, setData] = useState([]);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
    }));
  };

  const filterData = (filters) => {
    let _data = [...[], ...paymentHistoryData];
    setIsLoading(true);
    let _modifiedData = _data.filter((item) => {
      const matchesSearchQuery = filters?.searchQuery ? item.ConfirmationNumber.toLowerCase().includes(filters.searchQuery.toLowerCase()) || item.PurchaseOrderNumber.toString().includes(filters.searchQuery.toLowerCase()) : true;
      const matchesPaymentStatus = filters?.paymentStatus?.length > 0 ? filters.paymentStatus.includes(item.PaymentStatus) : true;
      const matchesPaymentMethod = filters?.paymentMethod?.length > 0 ? filters.paymentMethod.includes(item.PaymentMethod) : true;
      const matchesDateRange = filters.dateRange?.length === 2 ? new Date(item.date) >= new Date(filters.dateRange[0]) && new Date(item.date) <= new Date(filters.dateRange[1]) : true;

      return matchesSearchQuery && matchesPaymentStatus && matchesPaymentMethod && matchesDateRange;
    });

    const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;
    // Updating the page count and total records
    setPaginationConfig((state) => ({ ...state, totalPages: Math.ceil(_modifiedData.length / paginationConfig.pageSize), totalElements: _modifiedData.length }));
    setIsLoading(false);
    setData(_modifiedData.slice(startIndex, endIndex));
  };

  useEffect(() => {
    filterData(filterConfig);
  }, [filterConfig, paginationConfig.pageNumber]);

  const clearFilters = () => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  const applySort = (newSortConfig) => {
    setSortConfig(newSortConfig);
    sortData(newSortConfig);
  };

  const sortData = (newSortConfig) => {
    let _data = [...[], ...data];
    console.log('_data...', newSortConfig);

    // const ascendingByName = data.sort((a, b) => a.name.localeCompare(b.name));
    // console.log('Ascending:', ascendingByName);
    // // Descending order
    // const descendingByName = data.sort((a, b) => b.name.localeCompare(a.name));
    // //number
    // const ascendingByScore = data.sort((a, b) => a.score - b.score);
    // console.log('Ascending:', ascendingByScore);
    // // Descending order
    // const descendingByScore = data.sort((a, b) => b.score - a.score);
    // // Ascending order
    // const ascendingByDate = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    // console.log('Ascending:', ascendingByDate);
    // // Descending order
    // const descendingByDate = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    // console.log('Descending:', descendingByDate);

    // _data.sort((a,b)=>getSortLogic())
  };

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const contextValue = {
    data: data || [],
    isLoading,
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
  return <PaymentHistoryContext.Provider value={contextValue}>{children}</PaymentHistoryContext.Provider>;
};
