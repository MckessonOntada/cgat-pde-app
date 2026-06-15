import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import dayjs from 'dayjs';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useAccountContext } from './AccountContext';
import CommonUtils from '@src/util/CommonUtils';
import { GeographicUtils } from '@src/util/GeographicUtil';
import { useTranslate } from '@src/translations/useTranslation';
import { DUE_STATUS, INVOICE_STATUS } from '../pages/invoices/InvoiceConstants';
import useAlert from '@src/hooks/useAlert';
import { useLocation } from 'react-router-dom';

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
  soldToSite: [],
  billDate: '',
  dueDate: ''
};

const INITIAL_SORT_STATE = {
  sortBy: '',
  sortOrder: ''
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: RECORDS_PER_PAGE,
  totalPages: 0,
  pageNumber: 1
};

const sortByDueDateInitial = (invoices) =>
  [...invoices].sort((a, b) => {
    const hasA = !!a.dueDate;
    const hasB = !!b.dueDate;
    if (!hasA && !hasB) return 0;
    if (!hasA) return 1;
    if (!hasB) return -1;
    return dayjs(a.dueDate, 'DD/MM/YYYY') - dayjs(b.dueDate, 'DD/MM/YYYY');
  });

export const PaymentsInvoiceProvider = ({ children }) => {
  const { t } = useTranslate();
  const [data, setData] = useState([]);
  const [unSlicedData, setUnSlicedData] = useState([]);
  const [actualData, setActualData] = useState([]);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();
  const alertContainerId = 'summary-alert-container';
  const [previousFilterConfig, setPreviousFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [resetFilterData, setResetFilterData] = useState(true);
  const [statusOptions, setStatusOptions] = useState([]);
  const { selectedAccount } = useAccountContext();
  const isHistory = useLocation().pathname === '/record/invoices-history';
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
    setIsLoading(true);
    let startBillDate = filters.billDate[0];
    let endBillDate = filters.billDate[1];

    let startDueDate = filters.dueDate[0];
    let endDueDate = filters.dueDate[1];
    const _modifiedData = _data.filter((item) => {
      const matchesSearchQuery = filters?.searchQuery
        ? item.billNumber?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.soldToSite?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase())
        : true;

      const matchesPaymentStatus = filters?.paymentTerm?.length > 0 ? filters.paymentTerm.includes(item.paymentTerm?.toString()) : true;

      const matchesPaymentMethod = isHistory
        ? filters?.status?.length > 0
          ? filters.status.includes(item.clearingStatus?.toString())
          : true
        : filters?.status?.length > 0
        ? filters.status.includes(item.status?.toString())
        : true;

      const matchesBillDate =
        filters?.billDate?.length === 2
          ? !!startBillDate && !!endBillDate
            ? dayjs(item.billDate, 'DD/MM/YYYY').format('MM/DD/YYYY') >= dayjs(startBillDate).format('MM/DD/YYYY') &&
              dayjs(item.billDate, 'DD/MM/YYYY').format('MM/DD/YYYY') <= dayjs(endBillDate).format('MM/DD/YYYY')
            : !!startBillDate
            ? dayjs(item.billDate, 'DD/MM/YYYY').format('MM/DD/YYYY') >= dayjs(startBillDate).format('MM/DD/YYYY')
            : !!endBillDate
            ? dayjs(item.billDate, 'DD/MM/YYYY').format('MM/DD/YYYY') <= dayjs(endBillDate).format('MM/DD/YYYY')
            : true
          : true;

      const matchesDueDate =
        filters?.dueDate?.length === 2
          ? !!startDueDate && !!endDueDate
            ? dayjs(item.dueDate, 'DD/MM/YYYY').format('MM/DD/YYYY') >= dayjs(startDueDate).format('MM/DD/YYYY') &&
              dayjs(item.dueDate, 'DD/MM/YYYY').format('MM/DD/YYYY') <= dayjs(endDueDate).format('MM/DD/YYYY')
            : !!startDueDate
            ? dayjs(item.dueDate, 'DD/MM/YYYY').format('MM/DD/YYYY') >= dayjs(startDueDate).format('MM/DD/YYYY')
            : !!endDueDate
            ? dayjs(item.dueDate, 'DD/MM/YYYY').format('MM/DD/YYYY') <= dayjs(endDueDate).format('MM/DD/YYYY')
            : true
          : true;
      return matchesSearchQuery && matchesPaymentStatus && matchesPaymentMethod && matchesBillDate && matchesDueDate;
    });

    const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;

    setPaginationConfig((state) => ({
      ...state,
      totalPages: Math.ceil(_modifiedData.length / paginationConfig.pageSize),
      totalElements: _modifiedData.length
    }));

    setIsLoading(false);
    setData(_modifiedData.slice(startIndex, endIndex));
    setUnSlicedData(_modifiedData);
  };

  const { isFetching, isError, refetch } = useQuery(
    ['invoiceListing', [selectedAccount?.id, resetFilterData]],
    async () => {
      if (!selectedAccount?.id) return;
      const url = `${ApiRoutes.INVOICES_CREDITS_LISTING(selectedAccount?.id, false)}`;
      let payload = {
        companyCode: selectedAccount?.companyCode,
        salesOrg: selectedAccount?.salesOrg,
        payerAccountNumber: selectedAccount?.accountNumber,
        ...(isHistory && { clearedItems: 'X' })
      };

      const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);

      if (!res.data || !res.data.openInvoices) {
        showAlert({
          description: t('errors.default'),
          type: 'error',
          anchorEl: alertContainerId
        });
        setData([]);
        setUnSlicedData([]);
        setActualData([]);
        return;
      }
      const sortedInvoices = sortByDueDateInitial(res.data.openInvoices);
      const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
      const endIndex = startIndex + paginationConfig.pageSize;
      setData(sortedInvoices.slice(startIndex, endIndex));
      setUnSlicedData(sortedInvoices);
      setActualData(sortedInvoices);
      if (resetFilterData) {
        updateFilterData(sortedInvoices);
        setResetFilterData(false);
      }
      setPaginationConfig((state) => ({
        ...state,
        totalPages: Math.ceil(sortedInvoices.length / paginationConfig.pageSize),
        totalElements: sortedInvoices.length
      }));
    },
    {
      enabled: !!selectedAccount?.id,
      retry: 1,
      onError: (error) => {
        const { response } = error;
        setData([]);
        setUnSlicedData([]);
        setActualData([]);
        let errorMsg = response?.data?.message || 'Error fetching invoice listing';
        showAlert({
          description: t('errors.default'),
          type: 'error',
          anchorEl: alertContainerId
        });
      }
    }
  );

  useEffect(() => {
    filterData(filterConfig);
    if (JSON.stringify(sortConfig) !== JSON.stringify(INITIAL_SORT_STATE)) {
      sortData(sortConfig);
    }
  }, [filterConfig, paginationConfig.pageNumber]);

  useEffect(() => {
    clearFilters();
    setResetFilterData(true);
  }, [selectedAccount?.accountNumber]);

  const updateFilterData = (actualData) => {
    let currentFilterData = [...new Set(actualData.map((e) => e.status).filter((e) => e))];
    let currentFilterDataInvoiceHistory = [...new Set(actualData.map((e) => e.clearingStatus).filter((e) => e))];
    let _options;
    if (isHistory) {
      _options = currentFilterDataInvoiceHistory.map((item) => {
        return {
          value: item,
          label: INVOICE_STATUS[item]?.label || item,
          isDisabled: false
        };
      });
    } else {
      _options = currentFilterData.map((item) => {
        return {
          value: item,
          label: DUE_STATUS[item]?.label || item,
          isDisabled: false
        };
      });
    }
    setStatusOptions([..._options]);
  };

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
      switch (newSortConfig.sortBy) {
        case 'billNumber':
          return newSortConfig.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        case 'dueDate':
          if (!valA && !valB) return 0;
          if (newSortConfig.sortOrder === 'asc') {
            if (!valA) return 1;
            if (!valB) return -1;
            return dayjs(valA, 'DD/MM/YYYY') - dayjs(valB, 'DD/MM/YYYY');
          } else {
            if (!valA) return -1;
            if (!valB) return 1;
            return dayjs(valB, 'DD/MM/YYYY') - dayjs(valA, 'DD/MM/YYYY');
          }
        case 'status':
          return newSortConfig.sortOrder === 'asc'
            ? String(valA || '').localeCompare(String(valB || ''))
            : String(valB || '').localeCompare(String(valA || ''));
        case 'billDate':
          return newSortConfig.sortOrder === 'asc'
            ? dayjs(valA, 'DD/MM/YYYY') - dayjs(valB, 'DD/MM/YYYY')
            : dayjs(valB, 'DD/MM/YYYY') - dayjs(valA, 'DD/MM/YYYY');
        default:
          return newSortConfig.sortOrder === 'asc' ? valA - valB : valB - valA;
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

  const { mutate: exportInvoicesExcel } = useMutation(
    async (data) =>
      await HttpResourceService.callRest(
        `${ApiRoutes.EXPORT_INVOICES_EXCEL(selectedAccount?.accountNumber)}`,
        httpVerb.POST,
        data,
        undefined,
        false,
        false,
        false,
        'blob' // Set responseType to 'blob'
      ),
    {
      onSuccess: (response) => {
        if (response && response.data) {
          // Get the content-disposition header
          const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
          let fileName = 'PaymentInvoice.xlsx'; // Default name

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
          showAlert({
            description: `${t('paymentInvoices.excel.export.success')}`,
            type: 'success',
            anchorEl: alertContainerId
          });
        }
      },
      onError: (error) => {
        if (error && error.response && error.response.data && error.response.data) {
          showAlert({
            description: t('errors.default'),
            type: 'error',
            anchorEl: alertContainerId
          });
        }
      }
    }
  );

  const exportExcel = async () => {
    exportInvoicesExcel({
      companyCode: selectedAccount?.companyCode,
      salesOrg: selectedAccount?.salesOrg,
      payerAccountNumber: selectedAccount?.accountNumber,
      ...(isHistory && { clearedItems: 'X' }),
      openInvoiceFilterDTO: {
        searchTerm: filterConfig?.searchQuery || '',
        paymentTerm: filterConfig?.paymentTerm || [],
        status: filterConfig?.status?.map((statusKey) => DUE_STATUS[statusKey]?.label),
        billDateStart: CommonUtils.isNonEmptyString(filterConfig?.billDate[0]) ? dayjs(filterConfig?.billDate[0], 'MM/DD/YYYY').format('DD/MM/YYYY') : '' || '',
        billDateEnd: CommonUtils.isNonEmptyString(filterConfig?.billDate[1]) ? dayjs(filterConfig?.billDate[1], 'MM/DD/YYYY').format('DD/MM/YYYY') : '' || '',
        validFromStart: CommonUtils.isNonEmptyString(filterConfig?.dueDate[0]) ? dayjs(filterConfig?.dueDate[0], 'MM/DD/YYYY').format('DD/MM/YYYY') : '' || '',
        validFromEnd: CommonUtils.isNonEmptyString(filterConfig?.dueDate[1]) ? dayjs(filterConfig?.dueDate[1], 'MM/DD/YYYY').format('DD/MM/YYYY') : '' || ''
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
    refetch,
    applyFilters,
    clearFilters,
    applySort,
    setPageNumber,
    exportExcel,
    statusOptions,
    setStatusOptions
  };
  return <PaymentsInvoicesContext.Provider value={contextValue}>{children}</PaymentsInvoicesContext.Provider>;
};
