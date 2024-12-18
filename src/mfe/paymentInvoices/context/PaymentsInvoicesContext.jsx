import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';

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
  billNumber: [],
  soldToSite: []
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
  
  const [data, setData] = useState([]);
  const [unSlicedData, setUnSlicedData] = useState([]);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [isLoading, setIsLoading] = useState(false);
const { showSnackbar } = useSnackbar();


  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
    }));
  };

  const filterData = (filters) => {
    let _data = [...[], ...data];
    setIsLoading(true);
    let _modifiedData = _data.filter((item) => {
      const matchesSearchQuery = filters?.searchQuery
        ? item.billNumber?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.soldToSite?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.billDate?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.paymentTerm?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.dueDate?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.openAmount.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.billAmount?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase())
        : true;
      const matchesPaymentStatus = filters?.billNumber?.length > 0 ? filters.billNumber.includes(item.billNumber?.toString()) : true;
      const matchesPaymentMethod = filters?.soldToSite?.length > 0 ? filters.soldToSite.includes(item.soldToSite?.toString()) : true;
      const matchesDateRange = filters.dateRange?.length === 2 ? new Date(item.dueDate) >= new Date(filters.dateRange[0]) && new Date(item.dueDate) <= new Date(filters.dateRange[1]) : true;

      return matchesSearchQuery && matchesPaymentStatus && matchesPaymentMethod && matchesDateRange;
    });

    const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;
    // Updating the page count and total records
    setPaginationConfig((state) => ({ ...state, totalPages: Math.ceil(_modifiedData.length / paginationConfig.pageSize), totalElements: _modifiedData.length }));
    setIsLoading(false);
    setUnSlicedData(_modifiedData);
    setData(_modifiedData.slice(startIndex, endIndex));
  };

  const { isFetching} = useQuery({
    queryKey: ['invoiceListing'],
    queryFn: async () => {
      const url = `${ApiRoutes.INVOICES_CREDITS_LISTING('123', false)}`;
      const payload = {
        companyCode: 'string',
        salesOrg: 'string',
        payerAccountNumber: 'string'
      };
      const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
      if (res.data) {
        setData(res.data?.openInvoices);
        setPaginationConfig((state) => ({ ...state, totalPages: Math.ceil(res.data?.openInvoices.length / paginationConfig.pageSize), totalElements: res.data?.openInvoices.length }));
      }
    },
    onError: (error) => {
      showSnackbar({ description: 'Error fetching invoice listing', type: 'error' });
    }
  });

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
    isFetching,
    // isError,
    filterConfig,
    paginationConfig,
    sortConfig,
    // refreshData,
    applyFilters,
    clearFilters,
    applySort,
    setPageNumber,

  };
  return <PaymentsInvoicesContext.Provider value={contextValue}>{children}</PaymentsInvoicesContext.Provider>;
};
