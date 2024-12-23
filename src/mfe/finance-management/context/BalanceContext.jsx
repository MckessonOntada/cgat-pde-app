import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useAccountContext } from '@src/mfe/finance-management/context/AccountContext';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';

const BalanceContext = createContext();

export const useBalanceContext = () => {
  return useContext(BalanceContext);
};

export const BalanceProvider = ({ children, initialData = [] }) => {
  const { t } = useTranslate();
  const { showSnackbar } = useSnackbar();
  const [data, setData] = useState(initialData);
  const [balanceData, setBalanceData] = useState([]);

  const { selectedAccount } = useAccountContext();

  const balanceMutation = useMutation(
    async (data) => {
      let apiUrl = ApiRoutes.GET_OPEN_INVOICE_BALANCES(selectedAccount?.accountNumber);
      let actionSpecificHttpVerb = httpVerb.POST;
      const res = await HttpResourceService.callRest(apiUrl, actionSpecificHttpVerb, data);
      return res;
    },
    {
      onSuccess: (res) => {
        const data = res?.data;
        if (data) {
          setBalanceData(data);
        }
      },
      onError: (error) => {
        if (error) {
          showSnackbar({ description: t('paymentInvoices.balanceAPI.error'), type: 'error' });
        }
      }
    }
  );

  useEffect(() => {
    if (selectedAccount && selectedAccount?.companyCode && selectedAccount?.salesOrg && selectedAccount?.accountNumber) {
      balanceMutation.mutate({
        companyCode: selectedAccount?.companyCode,
        salesOrg: selectedAccount?.salesOrg,
        payerAccountNumber: selectedAccount?.accountNumber
      });
    }
  }, [selectedAccount]);

  return (
    <BalanceContext.Provider
      value={{
        data,
        setData,
        mutate: balanceMutation.mutate,
        isMutating: balanceMutation.isLoading,
        balanceData,
        setBalanceData
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};
