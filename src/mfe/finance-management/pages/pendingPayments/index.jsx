import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import PendingPaymentTable from './pendingPaymentTable';
import './index.scss';
import { usePendingPayments } from '../../context/PendingPaymentsContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Button, Heading } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';

export default function PendingPayments(params) {
  const { t } = useTranslate();
  const { actualData, applyFilters, clearFilters, exportPDF, data } = usePendingPayments();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dateRangePicker',
        name: 'payOn',
        startDateLabel: t('paymentInvoices.pendingPayments.filter.payOnDateStart'),
        endDateLabel: t('paymentInvoices.pendingPayments.filter.payOnDateEnd')
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
        <ModuleHeader
          heading={<Heading as="h2">{t('paymentInvoices.table.schedulePayments')}</Heading>}
          controls={
            <div className="table-header">
              <Button variant="secondary" onClick={() => exportPDF()} disabled={data.length === 0} size="sm">
                {t('paymentInvoices.CS.ExportExcel')}
              </Button>
            </div>
          }
        />
        <PendingPaymentTable />
      </div>
    </React.Fragment>
  );
}
