import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import CommonUtils from '@src/util/CommonUtils';
import useSnackbar from '@src/hooks/useSnackbar';
import { GeographicUtils } from '@src/util/GeographicUtil';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation } from 'react-router-dom';

const ACCOUNTS_PER_SEARCH = 20;

const AccountContext = createContext();

export const useAccountContext = () => {
  return useContext(AccountContext);
};

export const AccountProvider = ({ children }) => {
  const { t } = useTranslate();
  const [searchText, setSearchText] = useState('');
  const [defaultPayToAccount, setDefaultPayToAccount] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [payToAccountsList, setPayToAccountsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccountRaw, setSelectedAccountRaw] = useState(null);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const location = useLocation();
  const { state } = location;
  const { showSnackbar } = useSnackbar();

  const formatPayToAccountsList = () => {
    const formattedAccounts = payToAccountsData.map((account, index) => ({
      index,
      label: `(${account.accountNumber}) ${account.accountName}`,
      labelDescription: GeographicUtils.addressAggregator(account),
      value: account.id
    }));
    setPayToAccountsList(formattedAccounts);
  };

  const getApiUrl = (searchText) => {
    const params = {
      pageNo: 0,
      pageSize: ACCOUNTS_PER_SEARCH,
      query: searchText
    };
    return `${ApiRoutes.PAY_TO_ACCOUNTS()}?${serializeParams(params)}`;
  };

  const {
    isFetching: fetchingAccounts,
    data: payToAccountsData,
    isError: errorFetchingAccounts,
    refetch: refetchPayToAccountsData,
    isFetched
  } = useQuery({
    queryKey: [searchText],
    queryFn: async () => {
      const response = await HttpResourceService.callRest(`${getApiUrl(searchText)}`, httpVerb.GET, {});
      if (response && response.data) {
        const { content } = response.data;
        setTotalAccounts(response.data.totalElements);
        if (!content || (Array.isArray(content) && content.length == 0)) {
          setPayToAccountsList([]);
        }
        return content;
      }
      return [];
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (errorFetchingAccounts) {
      showSnackbar({
        description: t('paymentInvoices.getAccountsAPI.error'),
        type: 'error'
      });
    }
  }, [errorFetchingAccounts]);

  const debouncedSetSearchText = useCallback(() => {
    let timeoutId;
    return (text) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setSearchText(text), 500);
    };
  }, []);

  const searchPayToAccounts = debouncedSetSearchText();
  useEffect(() => {
    if (CommonUtils.isNonEmptyArray(payToAccountsData)) {
      formatPayToAccountsList();
      const defaultAccount = payToAccountsData.find((account) => account.isDefault) || payToAccountsData[0];
      if (CommonUtils.isNonEmptyObject(defaultAccount)) {
        setDefaultPayToAccount(defaultAccount);
      }
    } else {
      if (isFetched) {
        setIsLoading(false);
      }
    }
  }, [payToAccountsData, errorFetchingAccounts]);

  useEffect(() => {
    if (CommonUtils.isNonEmptyObject(defaultPayToAccount) && !CommonUtils.isNonEmptyObject(selectedAccount)) {
      let _account = state?.selectedPayToAcc || defaultPayToAccount;
      setSelectedAccount(_account);
      setIsLoading(false);
    }
  }, [defaultPayToAccount]);

  const applyEvent = (selectedPayToAccountId) => {
    setSelectedAccount(selectedAccountRaw);
  };

  const { mutate: setDefaultAccount } = useMutation(
    async (accountId) => await HttpResourceService.callRest(`${ApiRoutes.SET_DEFAULT_PAY_TO_ACCOUNT(accountId)}`, httpVerb.PATCH, null),
    {
      onSuccess: (response) => {
        if (CommonUtils.isNonEmptyObject(response)) {
          refetchPayToAccountsData();
          showSnackbar({
            description: `${t('paymentInvoices.setDefaultAccountAPI.success')} ${selectedAccount?.accountName} (${
              selectedAccount?.accountNumber
            })`,
            type: 'success'
          });
        }
      },
      onError: (error) => {
        if (
          CommonUtils.isNonEmptyObject(error) &&
          CommonUtils.isNonEmptyObject(error.response) &&
          CommonUtils.isNonEmptyObject(error.response.data)
        ) {
          showSnackbar({
            description: CommonUtils.isNonEmptyString(error.response.data.message)
              ? error.response.data.message
              : t('paymentInvoices.setDefaultAccountAPI.error'),
            type: 'error'
          });
        }
      }
    }
  );

  const defaultSetEvent = () => {
    CommonUtils.isNonEmptyObject(selectedAccount) && setDefaultAccount(selectedAccount.accountNumber);
  };

  return (
    <AccountContext.Provider
      value={{
        payToAccountsList,
        selectedAccount,
        searchPayToAccounts,
        applyEvent,
        defaultSetEvent,
        defaultPayToAccount,
        isLoading,
        payToAccountsData,
        setSelectedAccountRaw,
        fetchingAccounts,
        totalAccounts
      }}>
      {children}
    </AccountContext.Provider>
  );
};
