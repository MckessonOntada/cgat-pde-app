import React from 'react';
import CreditCardsTable from './CreditCardsTable';
import './index.scss';
import { Button } from '@mckesson/mcp-component-library';
import InputField from '@src/components/form/InputField';
export default function PaymentHistory(params) {
  return (
    <React.Fragment>
      <div className="filterContainer">
        <InputField label={'Search bank accounts'} placeholder={'Select by name or number'} form={{}} field={{ name: 'field' }} />
      </div>
      <div className="table-header">
        <h1> Payment Listing</h1>
        <Button variant="secondary" onClick={() => {}} size="sm">
          Export Excel
        </Button>
      </div>
      <CreditCardsTable />
    </React.Fragment>
  );
}
