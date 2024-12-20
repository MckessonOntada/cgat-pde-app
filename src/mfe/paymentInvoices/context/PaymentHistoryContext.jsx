import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PaymentHistoryData } from '../mockData/PaymentHistoryData';
import { useQuery } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';
import { useAccountContext } from './AccountContext';
import dayjs from 'dayjs';

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
  const [data, setData] = useState([]);
  const [unSlicedData, setUnSlicedData] = useState([]);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { selectedAccount } = useAccountContext();

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
    }));
  };

  const filterData = (filters) => {
    let _data = [...[], ...unSlicedData];
    let _modifiedData = _data.filter((item) => {
      const matchesSearchQuery = filters?.searchQuery
        ? item.confirmationNo?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.purchaseOrderNo?.toString().includes(filters.searchQuery.toLowerCase()) ||
          item.paymentMethod?.toString().includes(filters.searchQuery.toLowerCase()) ||
          item.paymentInitiationDate?.toString().includes(filters.searchQuery.toLowerCase()) ||
          item.paymentStatus?.toString().includes(filters.searchQuery.toLowerCase()) ||
          item.totalAuthorizedPaymentAmount?.toString().includes(filters.searchQuery.toLowerCase())
        : true;
      const matchesPaymentStatus = filters?.paymentStatus?.length > 0 ? filters.paymentStatus.includes(item.paymentStatus) : true;
      const matchesPaymentMethod = filters?.paymentMethod?.length > 0 ? filters.paymentMethod.includes(item.paymentMethod) : true;

      return matchesSearchQuery && matchesPaymentStatus && matchesPaymentMethod;
    });

    const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;
    // Updating the page count and total records
    setPaginationConfig((state) => ({
      ...state,
      totalPages: Math.ceil(_modifiedData.length / paginationConfig.pageSize),
      totalElements: _modifiedData.length
    }));
    setData(_modifiedData.slice(startIndex, endIndex));
  };

  useEffect(() => {
    filterData(filterConfig);
  }, [filterConfig, paginationConfig.pageNumber]);

  const clearFilters = () => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig(INITIAL_FILTER_STATE);
  };
  const { isFetching, isError } = useQuery({
    queryKey: ['paymentHistorylisting', selectedAccount?.id],
    queryFn: async () => {
      if (!selectedAccount?.id) return;
      const url = `${ApiRoutes.PAYMENT_HISTORY_LISTING(selectedAccount?.id, false)}`;
      const payload = {
        companyCode: selectedAccount?.companyCode,
        salesOrg: selectedAccount?.salesOrg,
        payerAccountNumber: selectedAccount?.accountNumber,
        dateFrom: dayjs().subtract(180, 'day').format('DD/MM/YYYY'),
        dateTo: dayjs().format('DD/MM/YYYY')
      };
      const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
      if (res.data) {
        const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
        const endIndex = startIndex + paginationConfig.pageSize;
        setData(res.data?.paymentDetails.slice(startIndex, endIndex));
        setUnSlicedData(res.data?.paymentDetails);
        setPaginationConfig((state) => ({
          ...state,
          totalPages: Math.ceil(res.data?.paymentDetails.length / paginationConfig.pageSize),
          totalElements: res.data?.paymentDetails.length
        }));
      }
    },

    onError: (error) => {
      showSnackbar({ description: 'Error fetching invoice listing', type: 'error' });
    },
    enabled: !!selectedAccount?.id
  });

  const applySort = (newSortConfig) => {
    setSortConfig(newSortConfig);
    sortData(newSortConfig);
  };

  const sortData = (newSortConfig) => {
    let _data = [...[], ...data];

    let _modifiedData = _data.sort((a, b) => {
      const valA = a[newSortConfig.sortBy];
      const valB = b[newSortConfig.sortBy];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return newSortConfig.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return newSortConfig.sortOrder === 'asc' ? valA - valB : valB - valA;
      } else if (valA instanceof Date && valB instanceof Date) {
        return newSortConfig.sortOrder === 'asc' ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA);
      } else {
        return 0;
      }
    });
    const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;

    setData(_modifiedData.slice(startIndex, endIndex));
  };

  const getSortLogic = () => {};

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const contextValue = {
    data: data || [],
    actualData: unSlicedData || [],
    isFetching,
    isError,
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
