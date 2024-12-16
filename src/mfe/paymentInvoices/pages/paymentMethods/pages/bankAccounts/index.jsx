import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import BankAccountsTable from './BankAccountsTable';
import './index.scss';
import { usePaymentInvoices } from '@src/mfe/paymentInvoices/context/PaymentsInvoicesContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';
import InputField from '@src/components/form/InputField';

export default function BankAccounts(params) {
  const { t } = useTranslate();
  const { applyFilters, filterConfig, sortConfig, clearFilters } = usePaymentInvoices();

  return (
    <React.Fragment>
      <div className="filterContainer">
        <InputField label ={"Search bank accounts"} placeholder={"Select by name or number"}form={{}} field={{name:"field"}}/>
      </div>
      <div className="MCP-table-wrapper">
        <div className="table-header">
          <h1>Saved Cards</h1>
        </div>
        <BankAccountsTable />
      </div>
    </React.Fragment>
  );
}
