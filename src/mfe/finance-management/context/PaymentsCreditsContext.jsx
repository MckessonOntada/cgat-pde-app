import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import dayjs from 'dayjs';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';
import { useAccountContext } from './AccountContext';
import CommonUtils from '@src/util/CommonUtils';
import { useTranslate } from '@src/translations/useTranslation';
import { GeographicUtils } from '@src/util/GeographicUtil';

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
  billDate: '',
  dueDate: ''
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
  const { t } = useTranslate();
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
          ? filters.billDate[0] != '' && filters.billDate[1] != ''
            ? dayjs(item.billDate, 'DD/MM/YYYY').format('MM/DD/YYYY') >= dayjs(filters.billDate[0]).format('MM/DD/YYYY') &&
              dayjs(item.billDate, 'DD/MM/YYYY').format('MM/DD/YYYY') <= dayjs(filters.billDate[1]).format('MM/DD/YYYY')
            : filters.billDate[0] != ''
            ? dayjs(item.billDate, 'DD/MM/YYYY').format('MM/DD/YYYY') >= dayjs(filters.billDate[0]).format('MM/DD/YYYY')
            : filters.billDate[1] != ''
            ? dayjs(item.billDate, 'DD/MM/YYYY').format('MM/DD/YYYY') <= dayjs(filters.billDate[1]).format('MM/DD/YYYY')
            : true
          : true;

      const matchesDueDate =
        filters?.dueDate?.length === 2
          ? filters.dueDate[0] != '' && filters.dueDate[1] != ''
            ? dayjs(item.dueDate, 'DD/MM/YYYY').format('MM/DD/YYYY') >= dayjs(filters.dueDate[0]).format('MM/DD/YYYY') &&
              dayjs(item.dueDate, 'DD/MM/YYYY').format('MM/DD/YYYY') <= dayjs(filters.dueDate[1]).format('MM/DD/YYYY')
            : filters.dueDate[0] != ''
            ? dayjs(item.dueDate, 'DD/MM/YYYY').format('MM/DD/YYYY') >= dayjs(filters.dueDate[0]).format('MM/DD/YYYY')
            : filters.dueDate[1] != ''
            ? dayjs(item.dueDate, 'DD/MM/YYYY').format('MM/DD/YYYY') <= dayjs(filters.dueDate[1]).format('MM/DD/YYYY')
            : true
          : true;

      return matchesSearchQuery && matchesBillDate && matchesDueDate;
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

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const { mutate: exportCreditsExcel } = useMutation(
    async (data) =>
      await HttpResourceService.callRest(
        `${ApiRoutes.EXPORT_CREDITS_EXCEL(selectedAccount?.accountNumber)}`,
        httpVerb.POST,
        data,
        undefined,
        false,
        false,
        'blob' // Set responseType to 'blob'
      ),
    {
      onSuccess: (response) => {
        if (response && response.data) {
          // Get the content-disposition header
          const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
          let fileName = 'PaymentCredits.xlsx'; // Default name

          // Try to extract the file name from the header
          if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
            const matches = contentDisposition.match(/filename="([^"]+)"/);
            if (matches && matches[1]) {
              fileName = matches[1];
            }
          }

          // Create a blob from the response data
          const blob = new Blob([response.data], { type: 'application/xlsx' });

          // Create a download link
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName; // Use the extracted or default file name
          link.click();

          // Show success message
          showSnackbar({
            description: `${t('paymentInvoices.excel.export.success')}`,
            type: 'success'
          });
        }
      },
      onError: (error) => {
        if (error && error.response && error.response.data && error.response.data) {
          showSnackbar({
            description: CommonUtils.isNonEmptyString(error.response.data.message)
              ? error.response.data.message
              : t('paymentInvoices.excel.export.error'),
            type: 'error'
          });
        }
      }
    }
  );

  const exportExcel = async () => {
    exportCreditsExcel({
      companyCode: selectedAccount?.companyCode,
      salesOrg: selectedAccount?.salesOrg,
      payerAccountNumber: selectedAccount?.accountNumber,
      openInvoiceFilterDTO: {
        searchTerm: filterConfig?.searchQuery || '',
        paymentTerm: filterConfig?.paymentTerm || [],
        status: filterConfig?.status || [],
        billDateStart: CommonUtils.isNonEmptyString(filterConfig?.billDate[0])
          ? dayjs(filterConfig?.billDate[0], 'MM/DD/YYYY').format('DD/MM/YYYY')
          : '' || '',
        billDateEnd: CommonUtils.isNonEmptyString(filterConfig?.billDate[1])
          ? dayjs(filterConfig?.billDate[1], 'MM/DD/YYYY').format('DD/MM/YYYY')
          : '' || '',
        validFromStart: CommonUtils.isNonEmptyString(filterConfig?.dueDate[0])
          ? dayjs(filterConfig?.dueDate[0], 'MM/DD/YYYY').format('DD/MM/YYYY')
          : '' || '',
        validFromEnd: CommonUtils.isNonEmptyString(filterConfig?.dueDate[1])
          ? dayjs(filterConfig?.dueDate[1], 'MM/DD/YYYY').format('DD/MM/YYYY')
          : '' || ''
      },
      excelMetaDataDTO: {
        accountNumber: selectedAccount?.accountNumber,
        name: selectedAccount?.accountName,
        address: GeographicUtils.addressAggregator(selectedAccount)
      }
    });
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
    setPageNumber,
    exportExcel
  };
  return <PaymentsCreditsContext.Provider value={contextValue}>{children}</PaymentsCreditsContext.Provider>;
};
