import React from 'react';
import CreditCardsTable from './CreditCardsTable';
import './index.scss';
import { Button } from '@mckesson/mcp-component-library';
import InputField from '@src/components/form/InputField';
import { useTranslate } from '@src/translations/useTranslation';

export default function PaymentHistory(params) {
  const { t } = useTranslate();
  return (
    <React.Fragment>
      <div className="filterContainer">
        <InputField label={'Search bank accounts'} placeholder={'Select by name or number'} form={{}} field={{ name: 'field' }} />
      </div>
      <div className="table-header">
        <h1>{t('pendingPayments.table.heading')}</h1>
        <Button variant="secondary" onClick={() => {}} size="sm">
          {t('paymentInvoices.CS.ExportExcel')}
        </Button>
      </div>
      <CreditCardsTable />
    </React.Fragment>
  );
}
