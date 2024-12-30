import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';
import { useAccountContext } from './AccountContext';
import CommonUtils from '@src/util/CommonUtils';

const PaymentsCreditsContext = createContext();

export const usePaymentCredits = () => {
  const context = useContext(PaymentsCreditsContext);
  if (!context) {
    throw new Error('usePaymentCredits must be used within a PaymentsInvoiceProvider.');
  }
  return context;
};
const RECORDS_PER_PAGE = 8;

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  billNumber: [],
  soldToSite: [],
  billDate: ''
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

export const PaymentsCreditsProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [unSlicedData, setUnSlicedData] = useState([]);
  const [actualData, setActualData] = useState([]);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const { showSnackbar } = useSnackbar();
  const [previousFilterConfig, setPreviousFilterConfig] = useState(INITIAL_FILTER_STATE);

  const { selectedAccount } = useAccountContext();

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
    }));
  };

  const filterData = async (filters) => {
    if (JSON.stringify(filters.billDate) !== JSON.stringify(previousFilterConfig.billDate)) {
      await refetch();
      setPreviousFilterConfig(filters);
    }
    let _data = [...[], ...actualData];
    let _modifiedData = _data.filter((item) => {
      const matchesSearchQuery = filters?.searchQuery
        ? item.billNumber?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase())
        : true;
      const matchesBillDate =
        filters?.billDate?.length === 2
          ? new Date(dayjs(item.billDate, 'DD/MM/YYYY').format('MM/DD/YYYY')) >=
              new Date(CommonUtils.isNonEmptyString(filters.billDate[0]) ? dayjs(filters.billDate[0]).format('MM/DD/YYYY') : new Date()) &&
            new Date(dayjs(item.billDate, 'DD/MM/YYYY').format('MM/DD/YYYY')) <=
              new Date(CommonUtils.isNonEmptyString(filters.billDate[1]) ? dayjs(filters.billDate[1]).format('MM/DD/YYYY') : new Date())
          : true;
      return matchesSearchQuery && matchesBillDate;
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

  const { isFetching, isError, refetch } = useQuery(
    ['creditListing', selectedAccount?.id],
    async () => {
      if (!selectedAccount?.id) return;
      const url = `${ApiRoutes.INVOICES_CREDITS_LISTING(selectedAccount?.id, true)}`;
      let payload = {
        companyCode: selectedAccount?.companyCode,
        salesOrg: selectedAccount?.salesOrg,
        payerAccountNumber: selectedAccount?.accountNumber
      };
      //  if(filterConfig.billDate?.length>0 && JSON.stringify(filterConfig.billDate) !== JSON.stringify(previousFilterConfig.billDate)){
      //   payload={...payload,...{dateFrom:filterConfig.billDate[0]??"",dateTo:filterConfig.billDate[1]??""}}
      //  }
      const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
      if (res.data) {
        const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
        const endIndex = startIndex + paginationConfig.pageSize;
        setData(res.data?.openInvoices.slice(startIndex, endIndex));
        setUnSlicedData(res.data?.openInvoices);
        setActualData(res.data?.openInvoices);
        setPaginationConfig((state) => ({
          ...state,
          totalPages: Math.ceil(res.data?.openInvoices.length / paginationConfig.pageSize),
          totalElements: res.data?.openInvoices.length
        }));
      }
    },
    {
      enabled: !!selectedAccount?.id,
      onError: (error) => {
        showSnackbar({ description: 'Error fetching invoice listing', type: 'error' });
      }
    }
  );
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

      if (typeof valA === 'string' && typeof valB === 'string' && newSortConfig.sortBy !== 'billDate') {
        return newSortConfig.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return newSortConfig.sortOrder === 'asc' ? valA - valB : valB - valA;
      } else if (newSortConfig.sortBy === 'billDate') {
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
  return <PaymentsCreditsContext.Provider value={contextValue}>{children}</PaymentsCreditsContext.Provider>;
};
