import React from 'react';
import BankAccountsTable from './BankAccountsTable';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import InputField from '@src/components/form/InputField';

export default function BankAccounts(params) {
  const { t } = useTranslate();

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
