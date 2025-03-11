import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import InvoicesTable from './InvoicesTable';
import './index.scss';
import { usePaymentInvoices } from '../../context/PaymentsInvoicesContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';
import { DUE_STATUS } from './InvoiceConstants';

export default function Invoices(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, actualData } = usePaymentInvoices();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'paymentTerm',
        tableColumnId: 'paymentTerm',
        label: t('paymentInvoices.history.table.PaymentTerm'),
        options: []
      },
      {
        type: 'multiSelectDropdown',
        name: 'status',
        tableColumnId: 'status',
        customLabel: (data) => {
          return DUE_STATUS[data].label;
        },
        label: t('paymentInvoices.history.table.status'),
        options: []
      },
      {
        type: 'dateRangePicker',
        name: 'billDate',
        startDateLabel: t('paymentInvoices.invoicesTable.filter.billDateStart'),
        endDateLabel: t('paymentInvoices.invoicesTable.filter.billDateEnd')
      },
      {
        type: 'dateRangePicker',
        name: 'dueDate',
        startDateLabel: t('paymentInvoices.invoicesTable.filter.dueDateStart'),
        endDateLabel: t('paymentInvoices.invoicesTable.filter.dueDateEnd')
      }
      // {
      //   type: 'dateRangePicker',
      //   name: 'dueDate',
      //   startDateLabel: t('paymentInvoices.invoicesTable.filter.dueDateStart'),
      //   endDateLabel: t('paymentInvoices.invoicesTable.filter.dueDateEnd')
      // }
    ];
  }, []);
  return (
    <React.Fragment>
      <div className="MCP-CardContainer invoices-container">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={AdditionalFiltersConfig}
          searchPlaceholder={t('paymentInvoices.filter.search')}
          actualData={actualData}
        />
      </div>
      <div className="MCP-table-wrapper table-wrapper">
        <InvoicesTable />
      </div>
    </React.Fragment>
  );
}
