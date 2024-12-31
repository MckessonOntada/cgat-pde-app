import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PayToAccounts } from '../mockData/PayToAccounts';
import { useMutation, useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import CommonUtils from '@src/util/CommonUtils';
import useSnackbar from '@src/hooks/useSnackbar';
import { GeographicUtils } from '@src/util/GeographicUtil';
import { useTranslate } from '@src/translations/useTranslation';

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

  const apiUrl = useMemo(() => {
    const params = {
      pageNo: 0,
      pageSize: ACCOUNTS_PER_SEARCH,
      query: searchText
    };
    return `${ApiRoutes.PAY_TO_ACCOUNTS}?${serializeParams(params)}`;
  }, [searchText]);

  const {
    isLoading: fetchingAccounts,
    data: payToAccountsData,
    isError: errorFetchingAccounts,
    refetch: refetchPayToAccountsData
  } = useQuery({
    queryKey: [apiUrl],
    queryFn: async () => {
      const response = await HttpResourceService.callRest(`${apiUrl}`, httpVerb.GET, {});
      if (response && response.data) {
        const { content } = response.data;
        return content;
      }
      return [];
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (errorFetchingAccounts) {
      showSnackbar({ description: t('paymentInvoices.getAccountsAPI.error'), type: 'error' });
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
      if (!CommonUtils.isNonEmptyObject(defaultPayToAccount)) {
        CommonUtils.isNonEmptyObject(defaultAccount) && setDefaultPayToAccount(defaultAccount);
      }
    }
  }, [payToAccountsData]);

  useEffect(() => {
    if (CommonUtils.isNonEmptyObject(defaultPayToAccount)) {
      setSelectedAccount(defaultPayToAccount);
    }
  }, [defaultPayToAccount]);

  const applyEvent = (selectedPayToAccountId) => {
    setSelectedAccount(payToAccountsData.find((account) => account.id === selectedPayToAccountId));
  };

  const { mutate: setDefaultAccount } = useMutation(
    async (accountId) => await HttpResourceService.callRest(`${ApiRoutes.SET_DEFAULT_PAY_TO_ACCOUNT(accountId)}`, httpVerb.PATCH, null),
    {
      onSuccess: (response) => {
        if (CommonUtils.isNonEmptyObject(response)) {
          refetchPayToAccountsData();
          showSnackbar({
            description: `${t('paymentInvoices.setDefaultAccountAPI.success')} ${selectedAccount?.accountNumber}`,
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
        defaultPayToAccount
      }}>
      {children}
    </AccountContext.Provider>
  );
};
