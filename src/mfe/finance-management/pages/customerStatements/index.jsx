import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import './index.scss';
import { Button } from '@mckesson/mcp-component-library';
import CustomerStatementTable from './CustomerStatementTable';
import { useTranslate } from '@src/translations/useTranslation';
import { useCustomerStatements } from '../../context/CustomerStatementsContext';
import dayjs from 'dayjs';

export default function CustomerSatements(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, actualData } = useCustomerStatements();
  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dateRangePicker',
        name: 'dateRange',
        minDate: dayjs().subtract(180, 'days').toDate(),
        maxDate: new Date()
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
          searchPlaceholder={t('paymentInvoices.CS.filters.autoSearch')}
          actualData={actualData}
        />
      </div>
      <div className="MCP-table-wrapper">
        <div className="table-header">
          <Button variant="secondary" onClick={() => {}} size="sm" disabled>
            {t('paymentInvoices.CS.ExportExcel')}
          </Button>
        </div>
        <CustomerStatementTable />
      </div>
    </React.Fragment>
  );
}
