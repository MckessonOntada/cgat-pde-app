import React, { useEffect } from 'react';
import BankAccountsTable from './BankAccountsTable';
import './index.scss';
import InputField from '@src/components/form/InputField';
import { useTranslate } from '@src/translations/useTranslation';
import { usePaymentMethods } from '@src/mfe/finance-management/context/PaymentMethodsContext';

export default function BankAccounts(params) {
  const { t } = useTranslate();
  const { filterBankAccounts, refetchPaymentMethods } = usePaymentMethods();

  useEffect(() => {
    refetchPaymentMethods();
  }, []);

  return (
    <React.Fragment>
      <div className="filterContainer">
        <InputField
          label={t('paymentInvoices.paymentMethods.banks.filter.search.label')}
          placeholder={t('paymentInvoices.paymentMethods.filter.search.placeholder')}
          onInputChange={(event) => {
            filterBankAccounts(event.target.value);
          }}
          useRegister={false}
        />
      </div>
      <div className="table-header">
        <h1>{t('paymentInvoices.paymentMethods.table.bankAccounts.heading')}</h1>
      </div>
      <BankAccountsTable />
    </React.Fragment>
  );
}
