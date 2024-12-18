import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import InvoicesTable from './InvoicesTable';
import './index.scss';
import { usePaymentInvoices } from '../../context/PaymentsInvoicesContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';

export default function Invoices(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, data } = usePaymentInvoices();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'billNumber',
        id: 'billNumber',
        label: t('paymentInvoices.history.table.billNumber'),
        options: []
      },
      {
        type: 'multiSelectDropdown',
        name: 'soldToSite',
        id: 'soldToSite',
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
        <CommonFilters onApplyFilters={applyFilters} onClearFilters={clearFilters} additionalFilters={AdditionalFiltersConfig} searchPlaceholder={'Search by document number, sold to...'} filterData={data} />
      </div>
      <div className="MCP-table-wrapper">
        <div className="table-header">
          <h1> invoice Listing</h1>
          <Button variant="secondary" onClick={() => {}} size="sm">
            Export Excel
          </Button>
        </div>
        <InvoicesTable />
      </div>
    </React.Fragment>
  );
}
