import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';
import { useAccountContext } from './AccountContext';
import dayjs from 'dayjs';

const CustomerStatementsContext = createContext();

export const useCustomerStatements = () => {
  const context = useContext(CustomerStatementsContext);
  if (!context) {
    throw new Error('useCustomerStatements must be used within a CustomerStatementsContext.');
  }
  return context;
};
const RECORDS_PER_PAGE = 8;

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  billNumber: [],
  soldToSite: [],
  dateRange: ''
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

export const CustomerStatementsProvider = ({ children }) => {
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
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
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
        ? item.docNo?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.accountNumber?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.date?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.statementBalance?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase())
        : true;
      return matchesSearchQuery;
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

  const { isFetching, isError, data1, refetch } = useQuery({
    queryKey: ['CustomerStatements', selectedAccount?.id],
    queryFn: async () => {
      if (!selectedAccount?.id) return;
      const url = `${ApiRoutes.CUSTOMER_STATEMENTS_LISTING(selectedAccount?.id)}`;
      let payload = {
        companyCode: selectedAccount?.companyCode,
        salesOrg: selectedAccount?.salesOrg,
        payerAccountNumber: selectedAccount?.accountNumber,
        dateFrom: '2024-12-20',
        dateTo: '2024-12-20',
        // dateFrom: dayjs().subtract(180, 'day').format('DD/MM/YYYY'),
        // dateTo: dayjs().format('DD/MM/YYYY'),
        validDateRange: true
      };

      const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
      if (res.data) {
        const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
        const endIndex = startIndex + paginationConfig.pageSize;
        setData(res.data?.statements.slice(startIndex, endIndex));
        setUnSlicedData(res.data?.statements);
        setActualData(res.data?.statements);
        setPaginationConfig((state) => ({
          ...state,
          totalPages: Math.ceil(res.data?.statements.length / paginationConfig.pageSize),
          totalElements: res.data?.statements.length
        }));
      }
    },
    enabled: !!selectedAccount?.id,
    onError: (error) => {
      showSnackbar({ description: 'Error fetching customer statements listing', type: 'error' });
    }
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
  return <CustomerStatementsContext.Provider value={contextValue}>{children}</CustomerStatementsContext.Provider>;
};
