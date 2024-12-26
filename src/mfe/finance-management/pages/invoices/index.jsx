import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import InvoicesTable from './InvoicesTable';
import './index.scss';
import { usePaymentInvoices } from '../../context/PaymentsInvoicesContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';

export default function Invoices(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, actualData } = usePaymentInvoices();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dropdown',
        name: 'paymentTerm',
        tableColumnId: 'paymentTerm',
        label: t('paymentInvoices.history.table.PaymentTerm'),
        options: []
      },
      {
        type: 'dropdown',
        name: 'status',
        tableColumnId: 'status',
        customLabel: (data) => {
          return data == 'PLUS_91_DAYS_OVERDUE' ? '+91 DAYS OVERDUE' : `${data.match(/\d+/)[0]} DAYS OVERDUE`;
        },
        label: t('paymentInvoices.history.table.status'),
        options: []
      },
      {
        type: 'dateRangePicker',
        name: 'dateRange',
        startDateLabel: t('paymentInvoices.history.table.PostingDate'),
        endDateLabel: t('paymentInvoices.history.table.DueDate')
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
          searchPlaceholder={t('pendingPayments.filters.autoSearch')}
          actualData={actualData}
        />
      </div>
      <div className="MCP-table-wrapper">
        <div className="table-header">
          <h1>{t('paymentInvoices.history.table.heading')}</h1>
          <Button variant="secondary" onClick={() => {}} size="sm" disabled>
            {t('paymentInvoices.CS.ExportExcel')}
          </Button>
        </div>
        <InvoicesTable />
      </div>
    </React.Fragment>
  );
}
