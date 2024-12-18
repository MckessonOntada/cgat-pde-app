import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import CreditsTable from './CreditsTable';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';
import { usePaymentCredits } from '../../context/PaymentsCreditsContext';

export default function Credits(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, actualData } = usePaymentCredits();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'billNumber',
        label: t('paymentInvoices.history.table.billNumber'),
        id: 'billNumber',
        options: []
      },
      {
        type: 'multiSelectDropdown',
        label: t('paymentInvoices.history.table.SoldToSite'),
        name: 'soldToSite',
        id: 'soldToSite',
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
          <h1> Credits Listing</h1>
          <Button variant="secondary" onClick={() => {}} size="sm">
            Export Excel
          </Button>
        </div>
        <CreditsTable />
      </div>
    </React.Fragment>
  );
}
