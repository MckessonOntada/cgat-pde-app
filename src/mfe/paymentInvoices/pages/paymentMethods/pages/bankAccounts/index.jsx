import React from 'react';
import BankAccountsTable from './BankAccountsTable';
import './index.scss';
import InputField from '@src/components/form/InputField';
import { useTranslate } from '@src/translations/useTranslation';
import { usePaymentMethods } from '@src/mfe/paymentInvoices/context/PaymentMethodsContext';

export default function BankAccounts(params) {
  const { t } = useTranslate();
  const { filterBankAccounts } = usePaymentMethods();
  return (
    <React.Fragment>
      <div className="filterContainer">
        <InputField
          label={t('paymentInvoices.paymentMethods.filter.search.label')}
          placeholder={t('paymentInvoices.paymentMethods.filter.search.placeholder')}
          form={{}}
          field={{ name: 'field' }}
          onChangeFn={(event) => {
            filterBankAccounts(event.target.value);
          }}
          useRegister={false}
          isDisabled={true}
        />
      </div>
      <div className="table-header">
        <h1>{t('paymentInvoices.paymentMethods.table.cards.heading')}</h1>
      </div>
      <BankAccountsTable />
    </React.Fragment>
  );
}
