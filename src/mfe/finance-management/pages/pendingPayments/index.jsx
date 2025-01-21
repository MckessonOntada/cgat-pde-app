import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import PendingPaymentTable from './pendingPaymentTable';
import './index.scss';
import { usePendingPayments } from '../../context/PendingPaymentsContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';

export default function PendingPayments(params) {
  const { t } = useTranslate();
  const { actualData, applyFilters, clearFilters, exportPDF } = usePendingPayments();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      // {
      //   type: 'multiSelectDropdown',
      //   name: 'paymentStatus',
      //   tableColumnId: 'paymentStatus',
      //   label: t('pendingPayments.table.paymentStatus'),
      //   options: []
      // },
      // {
      //   type: 'dropdown',
      //   name: 'billDate',
      //   tableColumnId: 'payOn',
      //   label: t('pendingPayments.table.billDate'),
      //   options: []
      // },
      {
        type: 'dateRangePicker',
        name: 'paymentInitiationDate',
        startDateLabel: t('paymentInvoices.pendingPayments.filter.initiationDateStart'),
        endDateLabel: t('paymentInvoices.pendingPayments.filter.initiationDateEnd')
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
          <Button variant="secondary" onClick={() => exportPDF()} size="sm" >
            {t('paymentInvoices.CS.ExportExcel')}
          </Button>
        </div>
        <PendingPaymentTable />
      </div>
    </React.Fragment>
  );
}
