import React, { createContext, useContext, useState } from 'react';
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

export const PaymentMethodsProvider = ({ children, initialData = [] }) => {
  const { t } = useTranslate();
  const { selectedAccount } = useAccountContext();
  const [bankAccountsData, setBankAccountsData] = useState([]);
  // const [unslicedBankAccountsData, setUnslicedBankAccountsData] = useState([]);
  // const [bankFilterConfig, setBankFilterConfig] = useState(INITIAL_FILTER_STATE);
  // const [bankPaginationConfig, setBankPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  // const [bankSortConfig, setBankSortConfig] = useState(INITIAL_SORT_STATE);
  const [cardsData, setCardsData] = useState([]);
  // const [unslicedCardsData, setUnslicedCardsData] = useState([]);
  // const [cardsFilterConfig, setCardsFilterConfig] = useState(INITIAL_FILTER_STATE);
  // const [cardsPaginationConfig, setCardsPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  // const [cardsSortConfig, setCardsSortConfig] = useState(INITIAL_SORT_STATE);
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
      setBankAccountsData(res.data.banks);
      setCardsData(res.data.cards);
      return res.data;
    },
    enabled: !!selectedAccount?.id,
    onError: (error) => {
      if (CommonUtils.isNonEmptyObject(error)) {
        showSnackbar({ description: t('paymentInvoices.paymentMethods.api.error'), type: 'error' });
      }
    }
  });

  const filterBankAccounts = (query) => {
    console.log('query', query);
    const lowerQuery = query.toLowerCase();
    setBankAccountsData(bankAccountsData.filter((item) => item.name.toLowerCase().includes(lowerQuery) || item.accountNumber.includes(lowerQuery)));
  };

  const contextValue = {
    data: paymentMethodsData || [],
    bankAccountsData,
    cardsData,
    isFetching,
    isError,
    filterBankAccounts
  };
  return <PaymentMethodsContext.Provider value={contextValue}>{children}</PaymentMethodsContext.Provider>;
};
