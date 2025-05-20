import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';
import { useAccountContext } from './AccountContext';
import dayjs from 'dayjs';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';

const CustomerStatementsContext = createContext();

export const useCustomerStatements = () => {
  const context = useContext(CustomerStatementsContext);
  if (!context) {
    throw new Error(
      'useCustomerStatements must be used within a CustomerStatementsContext.'
    );
  }
  return context;
};
const RECORDS_PER_PAGE = 8;

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  billNumber: [],
  soldToSite: [],
  dateRange: [
    dayjs().subtract(179, 'day').format('MM/DD/YYYY'),
    dayjs().format('MM/DD/YYYY')
  ]
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
  const { t } = useTranslate();
  const [data, setData] = useState([]);
  const [unSlicedData, setUnSlicedData] = useState([]);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [previousFilterConfig, setPreviousFilterConfig] =
    useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(
    INITIAL_PAGINATION_STATE
  );
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const { showSnackbar } = useSnackbar();
  const { selectedAccount } = useAccountContext();
  const [actualData, setActualData] = useState([]);

  const applyFilters = (filters) => {
    const formattedStartDate = filters.dateRange[0]
      ? dayjs(filters.dateRange[0], 'MM/DD/YYYY').format('MM/DD/YYYY')
      : dayjs().subtract(179, 'day').format('MM/DD/YYYY');
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
    // if (JSON.stringify(filters.dateRange) !== JSON.stringify(previousFilterConfig.dateRange)) {
    //   await refetch();
    //   setPreviousFilterConfig(filters);
    // }
    let _data = [...[], ...actualData];
    let _modifiedData = _data.filter((item) => {
      const matchesSearchQuery = filters?.searchQuery
        ? item.docNo
            ?.toString()
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          item.accountNumber
            ?.toString()
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          item.date
            ?.toString()
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          item.statementBalance
            ?.toString()
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase())
        : true;
      return matchesSearchQuery;
    });

    const startIndex =
      (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
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
    queryKey: ['CustomerStatements', selectedAccount?.id, filterConfig],
    queryFn: async () => {
      if (!selectedAccount?.id) return;
      const url = `${ApiRoutes.CUSTOMER_STATEMENTS_LISTING(
        selectedAccount?.id
      )}`;
      let payload = {
        companyCode: selectedAccount?.companyCode,
        salesOrg: selectedAccount?.salesOrg,
        payerAccountNumber: selectedAccount?.accountNumber,
        dateFrom: dayjs(filterConfig.dateRange[0], 'MM/DD/YYYY').format(
          'DD/MM/YYYY'
        ),
        dateTo: dayjs(filterConfig.dateRange[1], 'MM/DD/YYYY').format(
          'DD/MM/YYYY'
        ),
        validDateRange: true
      };

      const res = await HttpResourceService.callRest(
        url,
        httpVerb.POST,
        payload
      );
      if (!res.data?.statements) {
        setData([]);
        setUnSlicedData([]);
        setActualData([]);
        return [];
      }
      if (res.data) {
        const startIndex =
          (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
        const endIndex = startIndex + paginationConfig.pageSize;
        let _data = [...[], ...res.data.statements];
        let _modifiedData = _data.filter((item) => {
          const matchesSearchQuery = filterConfig?.searchQuery
            ? item.docNo
                ?.toString()
                .toLowerCase()
                .includes(filterConfig.searchQuery.toLowerCase()) ||
              item.accountNumber
                ?.toString()
                .toLowerCase()
                .includes(filterConfig.searchQuery.toLowerCase()) ||
              item.date
                ?.toString()
                .toLowerCase()
                .includes(filterConfig.searchQuery.toLowerCase()) ||
              item.statementBalance
                ?.toString()
                .toLowerCase()
                .includes(filterConfig.searchQuery.toLowerCase())
            : true;
          return matchesSearchQuery;
        });

        setData(_modifiedData.slice(startIndex, endIndex));
        setUnSlicedData(res.data?.statements);
        setActualData(res.data?.statements);
        setPaginationConfig((state) => ({
          ...state,
          totalPages: Math.ceil(
            _modifiedData.length / paginationConfig.pageSize
          ),
          totalElements: _modifiedData.length
        }));
      }
    },
    enabled: !!selectedAccount?.id,
    retry: 1,
    onError: (error) => {
      const { response } = error;
      let errorMsg =
        response?.data?.message || 'Error fetching customer statements listing';
      showSnackbar({ description: errorMsg, type: 'error' });
    }
  });

  useEffect(() => {
    filterData(filterConfig);
    if (JSON.stringify(sortConfig) !== JSON.stringify(INITIAL_SORT_STATE)) {
      sortData(sortConfig);
    }
  }, [paginationConfig.pageNumber, sortConfig]);

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

      if (
        typeof valA === 'string' &&
        typeof valB === 'string' &&
        newSortConfig.sortBy !== 'date'
      ) {
        return newSortConfig.sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return newSortConfig.sortOrder === 'asc' ? valA - valB : valB - valA;
      } else if (newSortConfig.sortBy === 'date') {
        const dateA = dayjs(valA, 'DD/MM/YYYY');
        const dateB = dayjs(valB, 'DD/MM/YYYY');
        if (!dateA.isValid() || !dateB.isValid()) {
          return 0;
        }
        return newSortConfig.sortOrder === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      } else {
        return 0;
      }
    });
    const startIndex =
      (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;

    setData(_modifiedData.slice(startIndex, endIndex));
  };

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const { mutate: exportStatementPDF } = useMutation(
    async (data) => {
      const { url, payload, type } = data;
      return await HttpResourceService.callRest(
        url,
        httpVerb.POST,
        payload,
        undefined,
        false,
        false,
        'blob' // Set responseType to 'blob'
      );
    },
    {
      onSuccess: (response, variables) => {
        const { type } = variables;
        if (response && response.data) {
          // Get the content-disposition header
          const contentDisposition =
            response.headers['content-disposition'] ||
            response.headers['Content-Disposition'];
          let fileName = 'Customer Statement.' + type; // Default name

          // Try to extract the file name from the header
          if (
            contentDisposition &&
            contentDisposition.indexOf('filename=') !== -1
          ) {
            const matches = contentDisposition.match(/filename="([^"]+)"/);
            if (matches && matches[1]) {
              fileName = matches[1];
            }
          }

          // Create a blob from the response data
          const blob = new Blob([response.data], {
            type: 'application/' + type
          });

          // Create a download link
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName; // Use the extracted or default file name
          link.click();

          // Show success message
          showSnackbar({
            description: `${t('paymentInvoices.CS.export.success')}`,
            type: 'success'
          });
        }
      },
      onError: (error) => {
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data
        ) {
          showSnackbar({
            description: CommonUtils.isNonEmptyString(
              error.response.data.message
            )
              ? error.response.data.message
              : t('paymentInvoices.CS.export.error'),
            type: 'error'
          });
        }
      }
    }
  );

  const exportPDF = (url, payload, type) => {
    exportStatementPDF({ url, payload, type });
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
    setPageNumber,
    exportPDF
  };
  return (
    <CustomerStatementsContext.Provider value={contextValue}>
      {children}
    </CustomerStatementsContext.Provider>
  );
};
