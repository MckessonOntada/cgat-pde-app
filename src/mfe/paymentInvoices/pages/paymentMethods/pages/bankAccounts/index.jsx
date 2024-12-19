import React from 'react';
import BankAccountsTable from './BankAccountsTable';
import './index.scss';
import InputField from '@src/components/form/InputField';

export default function BankAccounts(params) {

  return (
    <React.Fragment>
      <div className="filterContainer">
        <InputField label ={"Search bank accounts"} placeholder={"Select by name or number"}form={{}} field={{name:"field"}}/>
      </div>
      <div className="MCP-table-wrapper">
        <BankAccountsTable />
      </div>
    </React.Fragment>
  );
}
