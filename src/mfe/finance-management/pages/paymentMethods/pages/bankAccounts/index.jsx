import React, { useEffect } from 'react';
import BankAccountsTable from './BankAccountsTable';
import './index.scss';
import InputField from '@src/components/form/InputField';
import { useTranslate } from '@src/translations/useTranslation';
import { usePaymentMethods } from '@src/mfe/finance-management/context/PaymentMethodsContext';
import ModuleHeader from '@src/components/module-header';
import { Heading } from '@mckesson/mcp-component-library';

export default function BankAccounts(params) {
  const { t } = useTranslate();
  const { filterBankAccounts, refetchPaymentMethods } = usePaymentMethods();

  useEffect(() => {
    refetchPaymentMethods();
  }, []);

  return (
    <React.Fragment>
      <div className="MCP-CardContainer">
        <div className="filterContainer">
          <InputField
            placeholder={t('paymentInvoices.paymentMethods.filter.search.placeholder')}
            onInputChange={(event) => {
              filterBankAccounts(event.target.value);
            }}
            useRegister={false}
          />
        </div>
      </div>
      <div className="MCP-table-wrapper">
        <ModuleHeader heading={<Heading as="h2">{t('paymentInvoices.table.savedBankAccount')}</Heading>} />
        <BankAccountsTable />
      </div>
    </React.Fragment>
  );
}
