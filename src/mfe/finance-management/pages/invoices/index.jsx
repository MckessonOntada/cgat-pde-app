import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import InvoicesTable from './InvoicesTable';
import './index.scss';
import { usePaymentInvoices } from '../../context/PaymentsInvoicesContext';
import { useTranslate } from '@src/translations/useTranslation';
import { useAccountContext } from '../../context/AccountContext';

export default function Invoices(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, statusOptions, setStatusOptions } =
    usePaymentInvoices();
  const { selectedAccount } = useAccountContext();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'status',
        label: t('paymentInvoices.history.table.status'),
        options: statusOptions,
        getUpdatedOptions: (e) => {
          if (e.length > 0) {
            setStatusOptions(e);
          }
        }
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
    ];
  }, [statusOptions]);
  return (
    <React.Fragment key={selectedAccount.id}>
      <div className="MCP-CardContainer invoices-container">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={AdditionalFiltersConfig}
          searchPlaceholder={t('paymentInvoices.filter.searchInvoice')}
        />
      </div>
      <div className="MCP-table-wrapper table-wrapper">
        <InvoicesTable />
      </div>
    </React.Fragment>
  );
}
