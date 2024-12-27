import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import CommonUtils from '@src/util/CommonUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';
import { useAccountContext } from './AccountContext';

const PaymentsInvoicesContext = createContext();

export const usePendingPayments = () => {
  const context = useContext(PaymentsInvoicesContext);
  if (!context) {
    throw new Error('usePendingPayments must be used within a PendingPaymentsProvider.');
  }
  return context;
};
const RECORDS_PER_PAGE = 8;

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  paymentInitiationDate: ''
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

export const PendingPaymentsProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [unSlicedData, setUnSlicedData] = useState([]);
  const [actualData, setActualData] = useState([]);
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
    let _data = [...[], ...actualData];
    setIsLoading(true);
    let _modifiedData = _data.filter((item) => {
      const matchesSearchQuery = filters?.searchQuery
        ? item?.confirmationNo?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item?.paymentMethod?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item?.paymentInitiationDate?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item?.authorizedAmt?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase())
        : true;
      // const matchesPaymentStatus =
      //   filters?.paymentStatus?.length > 0 ? filters.paymentStatus.includes(item.paymentStatus.toString()) : true;

      const matchesDate =
        filters?.paymentInitiationDate?.length === 2
          ? new Date(dayjs(item.paymentInitiationDate, 'DD/MM/YYYY').format('MM/DD/YYYY')) >=
              new Date(
                CommonUtils.isNonEmptyString(filters.paymentInitiationDate[0])
                  ? dayjs(filters.paymentInitiationDate[0]).format('MM/DD/YYYY')
                  : new Date()
              ) &&
            new Date(dayjs(item.paymentInitiationDate, 'DD/MM/YYYY').format('MM/DD/YYYY')) <=
              new Date(
                CommonUtils.isNonEmptyString(filters.paymentInitiationDate[1])
                  ? dayjs(filters.paymentInitiationDate[1]).format('MM/DD/YYYY')
                  : new Date()
              )
          : true;

      return matchesSearchQuery && matchesDate;
    });

    const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;
    // Updating the page count and total records
    setPaginationConfig((state) => ({
      ...state,
      totalPages: Math.ceil(_modifiedData.length / paginationConfig.pageSize),
      totalElements: _modifiedData.length
    }));
    setIsLoading(false);
    setData(_modifiedData.slice(startIndex, endIndex));
    setUnSlicedData(_modifiedData);
  };

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

  const { isFetching, isError } = useQuery({
    queryKey: ['pendingPaymentsListing', selectedAccount?.id],
    queryFn: async () => {
      const url = `${ApiRoutes.PENDING_PAYMENTS_LISTING(selectedAccount?.id)}`;
      const payload = {
        companyCode: selectedAccount?.companyCode,
        salesOrg: selectedAccount?.salesOrg,
        payerAccountNumber: selectedAccount?.accountNumber
      };
      const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
      if (res.data) {
        const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
        const endIndex = startIndex + paginationConfig.pageSize;
        setData(res.data.pendingPayments.slice(startIndex, endIndex));
        setUnSlicedData(res.data.pendingPayments);
        setActualData(res?.data?.pendingPayments);
        setPaginationConfig((state) => ({
          ...state,
          totalPages: Math.ceil(res.data?.pendingPayments.length / paginationConfig.pageSize),
          totalElements: res.data?.pendingPayments.length
        }));
      }
    },
    enabled: !!selectedAccount?.id,
    onError: (error) => {
      showSnackbar({ description: 'Error fetching Pending payments listing', type: 'error' });
    }
  });

  const sortData = (newSortConfig) => {
    let _data = [...[], ...unSlicedData];

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
    actualData: actualData || [],
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
  return <PaymentsInvoicesContext.Provider value={contextValue}>{children}</PaymentsInvoicesContext.Provider>;
};
