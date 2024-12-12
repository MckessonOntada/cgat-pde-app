import React, { useMemo } from 'react';
import Filters from './Filters';
import PaymentHistoryTable from './PaymentHistoryTable';
import './index.scss';
import { Button } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import { usePaymentHistory } from '../../context/PaymentHistoryContext';
import { useTranslate } from '@src/translations/useTranslation';

export default function PaymentHistory(params) {
  const { t } = useTranslate();
  const { applyFilters, filterConfig, sortConfig, clearFilters } = usePaymentHistory();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'Payment Status',
        label: t('paymentInvoices.history.filters.status'),
        options: []
      },
      {
        type: 'multiSelectDropdown',
        name: 'Payment Method',
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
        <CommonFilters onApplyFilters={applyFilters} onClearFilters={clearFilters} additionalFilters={AdditionalFiltersConfig} searchPlaceholder={t('orgManagement.org.placeholder')} />
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
