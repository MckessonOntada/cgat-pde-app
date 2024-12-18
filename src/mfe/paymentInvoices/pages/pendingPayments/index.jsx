import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import PendingPaymentTable from './pendingPaymentTable';
import './index.scss';
import { usePendingPayments } from '../../context/PendingPaymentsContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';

export default function PendingPayments(params) {
  const { t } = useTranslate();
  const { actualData, applyFilters, clearFilters } = usePendingPayments();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'confirmationNo',
        id: 'confirmationNo',
        label: t('pendingPayments.table.confirmationNumber'),
        options: []
      },
      {
        type: 'multiSelectDropdown',
        name: 'paymentMethod',
        id: 'paymentMethod',
        label: t('paymentInvoices.history.table.paymentMethod'),
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
      <div className="MCP-CardContainer">
        <CommonFilters onApplyFilters={applyFilters} onClearFilters={clearFilters} additionalFilters={AdditionalFiltersConfig} searchPlaceholder={'Search by document number, sold to...'} filterData={actualData} />
      </div>
      <div className="MCP-table-wrapper">
        <div className="table-header">
          <h1> Credit Listing</h1>
          <Button variant="secondary" onClick={() => {}} size="sm">
            Export Excel
          </Button>
        </div>
        <PendingPaymentTable />
      </div>
    </React.Fragment>
  );
}
