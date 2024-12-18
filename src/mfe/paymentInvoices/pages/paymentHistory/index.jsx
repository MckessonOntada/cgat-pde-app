import React, { useMemo } from 'react';
import Filters from './Filters';
import PaymentHistoryTable from './PaymentHistoryTable';
import './index.scss';
import { Button } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import { usePaymentHistory } from '../../context/PaymentHistoryContext';
import { useTranslate } from '@src/translations/useTranslation';

const paymentStatus = [
  {
    isDisabled: false,
    value: 'IN PROCESS',
    label: 'IN PROCESS'
  },
  {
    isDisabled: false,
    value: 'COMPLETED',
    label: 'COMPLETED'
  }
];

const paymentMethodOptions = [
  {
    isDisabled: false,
    value: '4600-FIRST CITIZEN',
    label: '4600-FIRST CITIZEN'
  },
  {
    isDisabled: false,
    value: '4600-FIRST CITIZEN CARD',
    label: '4600-FIRST CITIZEN CARD'
  }
];

export default function PaymentHistory(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, data } = usePaymentHistory();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'paymentStatus',
        id:'paymentStatus',
        label: t('paymentInvoices.history.filters.status'),
        options: []
      },
      {
        type: 'multiSelectDropdown',
        name: 'paymentMethod',
        id:'paymentMethod',
        label: t('paymentInvoices.history.filters.method'),
        options: []
      },
      {
        type: 'dateRangePicker',
        name: 'dateRange'
      }
    ];
  }, []);

  return (
    <React.Fragment>
      <div className="MCP-panel-container">
        <CommonFilters onApplyFilters={applyFilters} onClearFilters={clearFilters} additionalFilters={AdditionalFiltersConfig} searchPlaceholder={t('paymentInvoices.history.filters.autoSearch')} filterData={data}/>
      </div>
      <div className="table-header">
        <h1> Payment Listing</h1>
        <Button variant="secondary" onClick={() => {}} size="sm">
          Export Excel
        </Button>
      </div>
      <PaymentHistoryTable />
    </React.Fragment>
  );
}
