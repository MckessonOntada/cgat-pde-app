import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import PendingPaymentTable from './pendingPaymentTable';
import './index.scss';
import { usePendingPayments } from '../../context/PendingPaymentsContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';

export default function PendingPayments(params) {
  const { t } = useTranslate();
  const { actualData, applyFilters, clearFilters } = usePendingPayments();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'paymentStatus',
        tableColumnId: 'paymentStatus',
        label: t('pendingPayments.table.paymentStatus'),
        options: []
      },
      {
        type: 'dropdown',
        name: 'billDate',
        tableColumnId: 'billDate',
        label: t('pendingPayments.table.billDate'),
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
          <div>
            <h1>{t('pendingPayments.table.heading')} </h1>
            <h2 className="subHeader">{t('pendingPayments.table.paymentMethod.subHeader')}</h2>
          </div>

          <Button variant="secondary" onClick={() => {}} size="sm" disabled>
            {t('paymentInvoices.CS.ExportExcel')}
          </Button>
        </div>
        <PendingPaymentTable />
      </div>
    </React.Fragment>
  );
}
