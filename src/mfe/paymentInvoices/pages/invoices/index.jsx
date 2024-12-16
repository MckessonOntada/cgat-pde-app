import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import PaymentHistoryTable from './PaymentHistoryTable';
import './index.scss';
import { usePaymentInvoices } from '../../context/PaymentsInvoicesContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';

export default function Invoices(params) {
  const { t } = useTranslate();
  const { applyFilters, filterConfig, sortConfig, clearFilters } = usePaymentInvoices();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'Bill Number',
        label: t('paymentInvoices.history.table.billNumber'),
        options: []
      },
      {
        type: 'multiSelectDropdown',
        name: 'Solid To Site',
        label: t('paymentInvoices.history.table.SoldToSite'),
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
        <CommonFilters onApplyFilters={applyFilters} onClearFilters={clearFilters} additionalFilters={AdditionalFiltersConfig} searchPlaceholder={"Search by document number, sold to..."} />
      </div>
      <div className="MCP-table-wrapper">
        <div className="table-header">
          <h1> invoice Listing</h1>
          <Button variant="secondary" onClick={() => {}} size="sm">
            Export Excel
          </Button>
        </div>
        <PaymentHistoryTable />
      </div>
    </React.Fragment>
  );
}
