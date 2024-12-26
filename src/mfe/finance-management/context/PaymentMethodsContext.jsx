import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useAccountContext } from './AccountContext';
import CommonUtils from '@src/util/CommonUtils';
import { useTranslate } from '@src/translations/useTranslation';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';

const PaymentMethodsContext = createContext();

export const usePaymentMethods = () => {
  const context = useContext(PaymentMethodsContext);
  if (!context) {
    throw new Error('usePaymentMethods must be used within a PaymentInvoiceProvider.');
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

export const PaymentMethodsProvider = ({ children }) => {
  const { t } = useTranslate();
  const { selectedAccount } = useAccountContext();
  const [bankAccountsData, setBankAccountsData] = useState([]);
  const [unslicedBankAccountsData, setUnslicedBankAccountsData] = useState([]);
  // const [bankFilterConfig, setBankFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [bankPaginationConfig, setBankPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [bankSortConfig, setBankSortConfig] = useState(INITIAL_SORT_STATE);
  const [cardsData, setCardsData] = useState([]);
  const [unslicedCardsData, setUnslicedCardsData] = useState([]);
  // const [cardsFilterConfig, setCardsFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [cardsPaginationConfig, setCardsPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [cardsSortConfig, setCardsSortConfig] = useState(INITIAL_SORT_STATE);
  const { showSnackbar } = useSnackbar();

  const {
    isFetching,
    data: paymentMethodsData = [],
    refetch: refetchPaymentMethods,
    isError
  } = useQuery({
    queryKey: ['paymentMethods', selectedAccount?.id],
    queryFn: async () => {
      const url = `${ApiRoutes.PAYMENT_METHODS_LISTING(selectedAccount?.accountId)}`;
      const payload = {
        companyCode: selectedAccount?.companyCode,
        salesOrg: selectedAccount?.salesOrg,
        payerAccountNumber: selectedAccount?.accountNumber
      };
      const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
      // const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
      // const endIndex = startIndex + paginationConfig.pageSize;
      setUnslicedBankAccountsData(res.data.banks);
      setUnslicedCardsData(res.data.cards);
      return res.data;
    },
    enabled: !!selectedAccount?.id,
    onError: (error) => {
      if (CommonUtils.isNonEmptyObject(error)) {
        showSnackbar({ description: t('paymentInvoices.paymentMethods.api.error'), type: 'error' });
      }
    }
  });

  useEffect(() => {
    if (CommonUtils.isNonEmptyArray(unslicedBankAccountsData)) {
      setBankAccountsData(unslicedBankAccountsData);
    }
  }, [unslicedBankAccountsData]);

  useEffect(() => {
    if (CommonUtils.isNonEmptyArray(unslicedCardsData)) {
      setCardsData(unslicedCardsData);
    }
  }, [unslicedCardsData]);

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const filterBankAccounts = debounce((query) => {
    if (CommonUtils.isNonEmptyString(query)) {
      const lowerQuery = query.toLowerCase();
      setBankAccountsData(
        unslicedBankAccountsData.filter((item) => item.name.toLowerCase().includes(lowerQuery) || item.accountNumber.includes(lowerQuery))
      );
    } else {
      refetchPaymentMethods();
    }
  }, 300);

  const filterCreditCards = debounce((query) => {
    if (CommonUtils.isNonEmptyString(query)) {
      const lowerQuery = query.toLowerCase();
      setCardsData(
        unslicedCardsData.filter((item) => item.holderName.toLowerCase().includes(lowerQuery) || item.number.includes(lowerQuery))
      );
    } else {
      refetchPaymentMethods();
    }
  }, 300);

  const applyBankSort = (newSortConfig) => {
    setBankSortConfig(newSortConfig);
    setBankPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    if (bankPaginationConfig.pageNumber === 1) {
      sortBankData(newSortConfig);
    }
  };

  const sortBankData = (newSortConfig) => {
    let _data = [...[], ...unslicedBankAccountsData];

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
    const startIndex = (bankPaginationConfig.pageNumber - 1) * bankPaginationConfig.pageSize;
    const endIndex = startIndex + bankPaginationConfig.pageSize;

    setBankAccountsData(_modifiedData.slice(startIndex, endIndex));
  };

  const setBanksTablePageNumber = (pageNumber) => {
    setBankPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const applyCardsSort = (newSortConfig) => {
    setCardsSortConfig(newSortConfig);
    setCardsPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    if (cardsPaginationConfig.pageNumber === 1) {
      sortCardsData(newSortConfig);
    }
  };

  const sortCardsData = (newSortConfig) => {
    let _data = [...[], ...unslicedCardsData];

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
    const startIndex = (cardsPaginationConfig.pageNumber - 1) * cardsPaginationConfig.pageSize;
    const endIndex = startIndex + cardsPaginationConfig.pageSize;

    setCardsData(_modifiedData.slice(startIndex, endIndex));
  };

  const setCardsTablePageNumber = (pageNumber) => {
    setCardsPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const contextValue = {
    data: paymentMethodsData || [],
    bankAccountsData,
    cardsData,
    isFetching,
    isError,
    filterBankAccounts,
    filterCreditCards,
    refetchPaymentMethods,
    applyBankSort,
    applyCardsSort,
    bankPaginationConfig,
    cardsPaginationConfig,
    setBanksTablePageNumber,
    setCardsTablePageNumber
  };
  return <PaymentMethodsContext.Provider value={contextValue}>{children}</PaymentMethodsContext.Provider>;
};
