import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import './index.scss';
import { Button } from '@mckesson/mcp-component-library';
import CustomerStatementTable from './CustomerStatementTable';
import { useTranslate } from '@src/translations/useTranslation';
import { useCustomerStatements } from '../../context/CustomerStatementsContext';

export default function CustomerSatements(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, actualData } = useCustomerStatements();
  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dateRangePicker',
        name: 'dateRange'
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
          searchPlaceholder={'Search by document number, sold to...'}
          actualData={actualData}
        />
      </div>
      <div className="MCP-table-wrapper">
        <div className="table-header">
          <h1> {t('paymentInvoices.CS.StatementListing')}</h1>
          <Button variant="secondary" onClick={() => {}} size="sm">
            {t('paymentInvoices.CS.ExportExcel')}
          </Button>
        </div>
        <CustomerStatementTable />
      </div>
    </React.Fragment>
  );
}
