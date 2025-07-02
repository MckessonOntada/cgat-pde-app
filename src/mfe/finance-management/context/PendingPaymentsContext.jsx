import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import dayjs from 'dayjs';
import CommonUtils from '@src/util/CommonUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useAccountContext } from './AccountContext';
import { GeographicUtils } from '@src/util/GeographicUtil';
import useAlert from '@src/hooks/useAlert';
import { useTranslate } from '@src/translations/useTranslation';

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
  paymentInitiationDate: ['', '']
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
  const { selectedAccount } = useAccountContext();
  const [fileteredData, setfileteredData] = useState(false);

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
    }));
    setfileteredData(true);
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
        filters?.paymentInitiationDate?.length === 2 && !!filters?.paymentInitiationDate[0] && !!filters?.paymentInitiationDate[1]
          ? new Date(dayjs(item.paymentInitiationDate, 'DD/MM/YYYY').format('MM/DD/YYYY')) >=
              new Date(
                CommonUtils.isNonEmptyString(filters.paymentInitiationDate[0]) ? dayjs(filters.paymentInitiationDate[0]).format('MM/DD/YYYY') : new Date()
              ) &&
            new Date(dayjs(item.paymentInitiationDate, 'DD/MM/YYYY').format('MM/DD/YYYY')) <=
              new Date(
                CommonUtils.isNonEmptyString(filters.paymentInitiationDate[1]) ? dayjs(filters.paymentInitiationDate[1]).format('MM/DD/YYYY') : new Date()
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
    refetch();
    setfileteredData(false);
  };

  const applySort = (newSortConfig) => {
    setSortConfig(newSortConfig);
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    if (paginationConfig.pageNumber === 1) {
      sortData(newSortConfig);
    }
  };

  const { isFetching, isError, refetch } = useQuery({
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
    retry: 1,
    onError: (error) => {
      const { response } = error;
      let errorMsg = response?.data?.message || 'Error fetching Pending payments listing';
      showAlert({ description: t('errors.default'), type: 'error', anchorEl: alertContainerId });
    }
  });

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

  const getSortLogic = () => {};

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };
  const { mutate: exportPendingPDF } = useMutation(
    async (data) => {
      let startDate = filterConfig?.paymentInitiationDate?.[0] || null;
      let endDate = filterConfig?.paymentInitiationDate?.[1] || null;
      return await HttpResourceService.callRest(
        `${ApiRoutes.EXPORT_PENDING_PAYMENT_EXCEL(data)}`,
        httpVerb.POST,
        {
          companyCode: selectedAccount?.companyCode,
          salesOrg: selectedAccount?.salesOrg,
          payerAccountNumber: selectedAccount?.accountNumber,
          filter: {
            searchTerm: filterConfig?.searchQuery || '',
            initiationDateStart: startDate && startDate !== 'Invalid Date' ? dayjs(startDate, 'MM/DD/YYYY').format('DD/MM/YYYY') : '',
            initiationDateEnd: endDate && endDate !== 'Invalid Date' ? dayjs(endDate, 'MM/DD/YYYY').format('DD/MM/YYYY') : ''
          },
          excelMetaDataDTO: {
            accountNumber: selectedAccount?.accountNumber,
            name: selectedAccount?.accountName,
            address: GeographicUtils.addressAggregator(selectedAccount)
          }
        },
        undefined,
        false,
        false,
        false,
        'blob' // Set responseType to 'blob'
      );
    },
    {
      onSuccess: (response) => {
        if (response && response.data) {
          // Get the Content-Disposition header
          const contentDisposition = response.headers['content-disposition'];
          let fileName = 'Pending payments.xlsx'; // Default name

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
            description: `${t('paymentInvoices.pendingPayment.export.success')}`,
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

  const exportPDF = (data) => {
    exportPendingPDF({ accountNumber: selectedAccount?.accountNumber });
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
    exportPDF,
    fileteredData
  };
  return <PaymentsInvoicesContext.Provider value={contextValue}>{children}</PaymentsInvoicesContext.Provider>;
};
