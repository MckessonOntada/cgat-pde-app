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
        type: 'dateRangePicker',
        name: 'billDate',
        startDateLabel: t('paymentInvoices.invoicesTable.filter.billDateStart'),
        endDateLabel: t('paymentInvoices.invoicesTable.filter.billDateEnd')
      }
    ];
  }, []);
  return (
    <React.Fragment>
      <div className="MCP-CardContainer">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={AdditionalFiltersConfig}
          searchPlaceholder={t('paymentInvoices.filter.search')}
          actualData={actualData}
        />
      </div>
      <div className="MCP-table-wrapper credit-table-container">
        <div className="table-header">
          <h1>{t('paymentInvoices.credits.table.heading')}</h1>
          <Button variant="secondary" onClick={() => {}} size="sm" disabled>
            {t('paymentInvoices.CS.ExportExcel')}
          </Button>
        </div>
        <CreditsTable />
      </div>
    </React.Fragment>
  );
}
