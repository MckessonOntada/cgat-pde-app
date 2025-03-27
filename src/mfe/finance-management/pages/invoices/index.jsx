import React, { useEffect, useMemo, useState } from 'react';
import CommonFilters from '@src/components/Filters';
import InvoicesTable from './InvoicesTable';
import './index.scss';
import { usePaymentInvoices } from '../../context/PaymentsInvoicesContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';
import { DUE_STATUS } from './InvoiceConstants';
import CommonUtils from '@src/util/CommonUtils';

export default function Invoices(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, actualData } = usePaymentInvoices();

  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    if (!CommonUtils.isNonEmptyObject(statusOptions)) {
      let currentFilterData = [...new Set(actualData.map((e) => e.status).filter((e) => e))];
      let _options = currentFilterData.map((item) => {
        return { value: item, label: DUE_STATUS[item]?.label || item, isDisabled: false };
      });
      setStatusOptions([..._options]);
    }
  }, [actualData]);

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
      // {
      //   type: 'dateRangePicker',
      //   name: 'dueDate',
      //   startDateLabel: t('paymentInvoices.invoicesTable.filter.dueDateStart'),
      //   endDateLabel: t('paymentInvoices.invoicesTable.filter.dueDateEnd')
      // }
    ];
  }, [statusOptions]);
  return (
    <React.Fragment>
      <div className="MCP-CardContainer invoices-container">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={AdditionalFiltersConfig}
          searchPlaceholder={t('paymentInvoices.filter.search')}
        />
      </div>
      <div className="MCP-table-wrapper table-wrapper">
        <InvoicesTable />
      </div>
    </React.Fragment>
  );
}
