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
  paymentMethod: '',
  paymentStatus: '',
  dateRange: [dayjs().subtract(180, 'day').format('MM/DD/YYYY'), dayjs().format('MM/DD/YYYY')]
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
  const [previousFilterConfig, setPreviousFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const { showSnackbar } = useSnackbar();
  const { selectedAccount } = useAccountContext();
  const [actualData, setActualData] = useState([]);

  const applyFilters = (filters) => {
    const formattedStartDate = filters.dateRange[0]
      ? dayjs(filters.dateRange[0], 'MM/DD/YYYY').format('MM/DD/YYYY')
      : dayjs().subtract(180, 'day').format('MM/DD/YYYY');
    const formattedEndDate = filters.dateRange[1]
      ? dayjs(filters.dateRange[1], 'MM/DD/YYYY').format('MM/DD/YYYY')
      : dayjs().format('MM/DD/YYYY');
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters,
      dateRange: [formattedStartDate, formattedEndDate]
    }));
  };

  const filterData = async (filters) => {
    if (JSON.stringify(filters.dateRange) !== JSON.stringify(previousFilterConfig.dateRange)) {
      await refetch();
      setPreviousFilterConfig(filters);
    }
    let _data = [...[], ...actualData];
    let _modifiedData = _data.filter((item) => {
      const matchesSearchQuery = filters?.searchQuery
        ? item.confirmationNo?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.paymentMethod?.toString().includes(filters.searchQuery.toLowerCase()) ||
          item.paymentInitiationDate?.toString().includes(filters.searchQuery.toLowerCase()) ||
          item.paymentStatus?.toString().includes(filters.searchQuery.toLowerCase()) ||
          item.totalAuthorizedPaymentAmount?.toString().includes(filters.searchQuery.toLowerCase())
        : true;
      const matchesPaymentStatus = filters?.paymentStatus?.length > 0 ? filters.paymentStatus.includes(item.paymentStatus) : true;
      const matchesPaymentMethod = filters?.paymentMethod?.length > 0 ? filters.paymentMethod.includes(item.paymentMethod) : true;

      return matchesSearchQuery && matchesPaymentStatus && matchesPaymentMethod;
      // return matchesSearchQuery;
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
    setUnSlicedData(_modifiedData);
  };

  const { isFetching, isError, refetch } = useQuery({
    queryKey: ['paymentHistorylisting', selectedAccount?.id, filterConfig],
    queryFn: async () => {
      if (!selectedAccount?.id) return;
      const url = `${ApiRoutes.PAYMENT_HISTORY_LISTING(selectedAccount?.id)}`;
      const payload = {
        companyCode: selectedAccount?.companyCode,
        salesOrg: selectedAccount?.salesOrg,
        payerAccountNumber: selectedAccount?.accountNumber,
        dateFrom: dayjs(filterConfig.dateRange[0], 'MM/DD/YYYY').format('DD/MM/YYYY'),
        dateTo: dayjs(filterConfig.dateRange[1], 'MM/DD/YYYY').format('DD/MM/YYYY')
      };
      const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
      if (res.data) {
        const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
        const endIndex = startIndex + paginationConfig.pageSize;
        setData(res.data?.paymentDetails.slice(startIndex, endIndex));
        setUnSlicedData(res.data?.paymentDetails);
        setActualData(res.data?.paymentDetails);
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

  useEffect(() => {
    filterData(filterConfig);
    if (JSON.stringify(sortConfig) !== JSON.stringify(INITIAL_SORT_STATE)) {
      sortData(sortConfig);
    }
  }, [filterConfig, paginationConfig.pageNumber]);

  const clearFilters = () => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  const applySort = (newSortConfig) => {
    setSortConfig(newSortConfig);
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    if (paginationConfig.pageNumber === 1) {
      sortData(newSortConfig);
    }
  };

  const sortData = (newSortConfig) => {
    let _data = [...[], ...unSlicedData];

    let _modifiedData = _data.sort((a, b) => {
      const valA = a[newSortConfig.sortBy];
      const valB = b[newSortConfig.sortBy];

      if (typeof valA === 'string' && typeof valB === 'string' && newSortConfig.sortBy !== 'paymentInitiationDate') {
        return newSortConfig.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return newSortConfig.sortOrder === 'asc' ? valA - valB : valB - valA;
      } else if (newSortConfig.sortBy === 'paymentInitiationDate') {
        const dateA = dayjs(valA, 'DD/MM/YYYY');
        const dateB = dayjs(valB, 'DD/MM/YYYY');
        if (!dateA.isValid() || !dateB.isValid()) {
          return 0;
        }
        return newSortConfig.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return 0;
      }
    });
    const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;

    setData(_modifiedData.slice(startIndex, endIndex));
  };

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const contextValue = {
    data: data || [],
    actualData: actualData || [],
    isFetching,
    isError,
    filterConfig,
    paginationConfig,
    sortConfig,
    applyFilters,
    clearFilters,
    applySort,
    setPageNumber
  };
  return <PaymentHistoryContext.Provider value={contextValue}>{children}</PaymentHistoryContext.Provider>;
};
